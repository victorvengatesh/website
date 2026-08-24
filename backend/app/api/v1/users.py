from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

class WalletTopup(BaseModel):
    amount: float

class WalletBalance(BaseModel):
    balance: float

@router.get("/{phone}/wallet", response_model=WalletBalance)
async def get_wallet_balance(phone: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == phone))
    user = result.scalar_one_or_none()
    if not user:
        return WalletBalance(balance=0.0)
    return WalletBalance(balance=user.wallet_balance)

@router.post("/{phone}/wallet/topup", response_model=WalletBalance)
async def topup_wallet(phone: str, payload: WalletTopup, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == phone))
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(name="Guest", phone=phone)
        db.add(user)
    
    user.wallet_balance += payload.amount
    await db.commit()
    
    return WalletBalance(balance=user.wallet_balance)
