from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.order import OrderCreate, OrderOut
from app.services.order_service import create_order, get_order


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post(
    "",
    response_model=OrderOut,
    status_code=201,
)
async def place_order(
    payload: OrderCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_order(
        db,
        payload,
    )


@router.get(
    "/{order_id}",
    response_model=OrderOut,
)
async def track_order(
    order_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await get_order(
        db,
        order_id,
    )
