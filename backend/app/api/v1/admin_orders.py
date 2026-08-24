from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.schemas.order import (
    AcceptOrderRequest,
    OrderOut,
    UpdateOrderStatusRequest,
)
from app.services.order_service import (
    accept_order,
    update_order_status,
)


router = APIRouter(
    prefix="/admin/orders",
    tags=["Admin Orders"],
)


@router.get(
    "",
    response_model=list[OrderOut],
)
async def list_orders(
    status: OrderStatus | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )

    if status:
        query = query.where(Order.status == status)

    result = await db.execute(query)

    return result.scalars().unique().all()


@router.patch(
    "/{order_id}/accept",
    response_model=OrderOut,
)
async def admin_accept_order(
    order_id: UUID,
    payload: AcceptOrderRequest,
    db: AsyncSession = Depends(get_db),
):
    return await accept_order(
        db,
        order_id,
        payload.eta_text,
    )


@router.patch(
    "/{order_id}/status",
    response_model=OrderOut,
)
async def admin_update_order_status(
    order_id: UUID,
    payload: UpdateOrderStatusRequest,
    db: AsyncSession = Depends(get_db),
):
    return await update_order_status(
        db,
        order_id,
        payload.status,
        payload.admin_note,
    )
