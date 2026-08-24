from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User, UserRole
from app.schemas.order import OrderCreate
from app.services.distance_service import calculate_delivery_distance
from app.services.pricing_service import calculate_delivery_fee


async def get_order(
    db: AsyncSession,
    order_id: UUID,
) -> Order:
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )

    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    return order


async def get_or_create_customer(
    db: AsyncSession,
    name: str,
    phone: str,
) -> User:
    result = await db.execute(
        select(User).where(User.phone == phone)
    )
    user = result.scalar_one_or_none()

    if user:
        if user.name != name:
            user.name = name
        return user

    user = User(
        name=name,
        phone=phone,
        role=UserRole.CUSTOMER,
    )
    db.add(user)
    await db.flush()
    return user


async def create_order(
    db: AsyncSession,
    payload: OrderCreate,
) -> Order:
    if not payload.items:
        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one item",
        )

    product_ids = [item.product_id for item in payload.items if item.product_id]
    product_skus = [item.sku for item in payload.items if item.sku]
    product_references = [str(item.product_id or item.sku) for item in payload.items]

    if len(product_references) != len(set(product_references)):
        raise HTTPException(
            status_code=400,
            detail="Duplicate product rows are not allowed",
        )

    try:
        distance = calculate_delivery_distance(
            payload.latitude,
            payload.longitude,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    if distance > settings.max_delivery_distance_km:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Delivery location is {distance} km away. "
                f"Current maximum delivery radius is "
                f"{settings.max_delivery_distance_km} km."
            ),
        )

    product_filters = []
    if product_ids:
        product_filters.append(Product.id.in_(product_ids))
    if product_skus:
        product_filters.append(Product.sku.in_(product_skus))

    result = await db.execute(
        select(Product)
        .where(or_(*product_filters))
        .with_for_update()
    )

    products_by_id = {
        product.id: product
        for product in result.scalars().all()
    }
    products_by_sku = {
        product.sku: product
        for product in products_by_id.values()
    }

    subtotal = 0
    order_items = []

    for item in payload.items:
        product = (
            products_by_id.get(item.product_id)
            if item.product_id
            else products_by_sku.get(item.sku)
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id or item.sku} not found",
            )

        if not product.active:
            raise HTTPException(
                status_code=400,
                detail=f"{product.name} is currently unavailable",
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=409,
                detail=f"Only {product.stock} unit(s) of {product.name} available",
            )

        line_total = product.price * item.quantity
        subtotal += line_total

        product.stock -= item.quantity

        order_items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=item.quantity,
                unit_price=product.price,
                line_total=line_total,
            )
        )

    customer = await get_or_create_customer(
        db,
        payload.recipient_name,
        payload.phone,
    )

    delivery_fee = calculate_delivery_fee(distance)
    total = subtotal + delivery_fee

    order = Order(
        user_id=customer.id,
        status=OrderStatus.PENDING_CONFIRMATION,
        recipient_name=payload.recipient_name,
        phone=payload.phone,
        address_line=payload.address_line,
        city=payload.city,
        pincode=payload.pincode,
        latitude=payload.latitude,
        longitude=payload.longitude,
        distance_km=distance,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=total,
        items=order_items,
    )

    db.add(order)

    await db.commit()

    return await get_order(db, order.id)


async def accept_order(
    db: AsyncSession,
    order_id: UUID,
    eta_text: str,
) -> Order:
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id)
        .with_for_update()
    )

    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status != OrderStatus.PENDING_CONFIRMATION:
        raise HTTPException(
            status_code=409,
            detail="Only pending orders can be accepted",
        )

    order.status = OrderStatus.CONFIRMED
    order.eta_text = eta_text.strip()
    order.accepted_at = datetime.now(timezone.utc)

    await db.commit()

    return await get_order(db, order.id)


ALLOWED_TRANSITIONS = {
    OrderStatus.PENDING_CONFIRMATION: {
        OrderStatus.CONFIRMED,
        OrderStatus.REJECTED,
        OrderStatus.CANCELLED,
    },
    OrderStatus.CONFIRMED: {
        OrderStatus.PREPARING,
        OrderStatus.REJECTED,
        OrderStatus.CANCELLED,
    },
    OrderStatus.PREPARING: {
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.CANCELLED,
    },
    OrderStatus.OUT_FOR_DELIVERY: {
        OrderStatus.DELIVERED,
    },
    OrderStatus.DELIVERED: set(),
    OrderStatus.REJECTED: set(),
    OrderStatus.CANCELLED: set(),
}


async def update_order_status(
    db: AsyncSession,
    order_id: UUID,
    new_status: OrderStatus,
    admin_note: str | None = None,
) -> Order:
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id)
        .with_for_update()
    )

    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if new_status not in ALLOWED_TRANSITIONS[order.status]:
        raise HTTPException(
            status_code=409,
            detail=(
                f"Invalid status transition: "
                f"{order.status.value} -> {new_status.value}"
            ),
        )

    # Restore stock when a not-yet-delivered order is rejected/cancelled.
    if new_status in {OrderStatus.REJECTED, OrderStatus.CANCELLED}:
        item_result = await db.execute(
            select(OrderItem).where(OrderItem.order_id == order.id)
        )
        items = item_result.scalars().all()

        product_ids = [item.product_id for item in items]

        product_result = await db.execute(
            select(Product)
            .where(Product.id.in_(product_ids))
            .with_for_update()
        )

        product_map = {
            product.id: product
            for product in product_result.scalars().all()
        }

        for item in items:
            product = product_map.get(item.product_id)
            if product:
                product.stock += item.quantity

    order.status = new_status
    order.admin_note = admin_note

    await db.commit()

    return await get_order(db, order.id)
