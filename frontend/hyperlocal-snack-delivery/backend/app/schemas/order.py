import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(gt=0, le=50)


class OrderCreate(BaseModel):
    recipient_name: str = Field(min_length=2, max_length=150)
    phone: str = Field(min_length=8, max_length=20)

    address_line: str = Field(min_length=5, max_length=500)
    city: str = Field(min_length=2, max_length=100)
    pincode: str = Field(min_length=4, max_length=10)

    latitude: float | None = None
    longitude: float | None = None

    items: list[OrderItemCreate]


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    quantity: int
    unit_price: Decimal
    line_total: Decimal


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: OrderStatus

    recipient_name: str
    phone: str

    address_line: str
    city: str
    pincode: str

    latitude: float | None
    longitude: float | None
    distance_km: float | None

    subtotal: Decimal
    delivery_fee: Decimal
    total: Decimal

    eta_text: str | None
    admin_note: str | None

    created_at: datetime
    updated_at: datetime

    items: list[OrderItemOut]


class AcceptOrderRequest(BaseModel):
    eta_text: str = Field(min_length=2, max_length=200)


class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus
    admin_note: str | None = Field(default=None, max_length=300)
