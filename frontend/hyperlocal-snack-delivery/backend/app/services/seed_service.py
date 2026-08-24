from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


SAMPLE_PRODUCTS = [
    {
        "sku": "MIX-100",
        "name": "Special Mixture",
        "description": "Crunchy traditional spicy mixture.",
        "price": Decimal("60.00"),
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    },
    {
        "sku": "MUR-100",
        "name": "Butter Murukku",
        "description": "Crispy South Indian butter murukku.",
        "price": Decimal("70.00"),
        "stock": 40,
        "image_url": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    },
    {
        "sku": "BAN-100",
        "name": "Banana Chips",
        "description": "Thin and crispy banana chips.",
        "price": Decimal("80.00"),
        "stock": 35,
        "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
    },
    {
        "sku": "PEA-100",
        "name": "Masala Peanuts",
        "description": "Crunchy peanuts coated with masala.",
        "price": Decimal("50.00"),
        "stock": 60,
        "image_url": "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=800&q=80",
    },
    {
        "sku": "LAD-001",
        "name": "Laddu",
        "description": "Classic sweet laddu.",
        "price": Decimal("25.00"),
        "stock": 80,
        "image_url": "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=80",
    },
    {
        "sku": "HAL-250",
        "name": "Halwa 250g",
        "description": "Soft traditional halwa.",
        "price": Decimal("120.00"),
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1605196560547-1f27f70058ea?auto=format&fit=crop&w=800&q=80",
    },
]


async def seed_products(db: AsyncSession):
    result = await db.execute(select(Product.id).limit(1))
    if result.scalar_one_or_none():
        return

    for data in SAMPLE_PRODUCTS:
        db.add(Product(**data))

    await db.commit()
