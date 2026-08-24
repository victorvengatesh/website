from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


def product(sku: str, name: str, description: str, price: str, stock: int, image: str):
    return {
        "sku": sku,
        "name": name,
        "description": description,
        "price": Decimal(price),
        "stock": stock,
        "image_url": image,
        "active": True,
    }


SAMPLE_PRODUCTS = [
    product("MIX-100", "Signature Special Mixture", "Curry leaf, peanuts and a many-layered crunch.", "129.00", 64, "/images/special-mixture.jpg"),
    product("MUR-100", "Butter Murukku", "Feather-light rice flour spirals with butter and cumin.", "139.00", 42, "/images/categories/savoury.svg"),
    product("SAV-BOO-180", "Kara Boondi", "Golden boondi tossed with chilli, garlic and cashews.", "119.00", 51, "/images/categories/savoury.svg"),
    product("SAV-RIB-200", "Ribbon Pakoda", "Rippled rice and gram flour ribbons with sesame.", "125.00", 38, "/images/categories/savoury.svg"),
    product("PEA-100", "Madras Masala Peanuts", "Crunch-coated peanuts with tomato, chilli and lime.", "109.00", 75, "/images/categories/savoury.svg"),
    product("BAN-100", "Nendran Banana Chips", "Kerala banana chips cooked in coconut oil.", "149.00", 58, "/images/categories/chips.svg"),
    product("CHP-TAP-200", "Pepper Tapioca Chips", "Rustic tapioca slices with cracked black pepper.", "135.00", 44, "/images/categories/chips.svg"),
    product("CHP-JAC-150", "Jackfruit Chips", "Delicately sweet jackfruit crisps.", "179.00", 31, "/images/categories/chips.svg"),
    product("CHP-POT-180", "Pepper Potato Crisps", "Kettle-style potato with pepper and curry leaf.", "125.00", 68, "/images/categories/chips.svg"),
    product("CHP-GAR-180", "Chilli Garlic Chips", "Ridged chips with roasted garlic and red chilli.", "129.00", 49, "/images/categories/chips.svg"),
    product("SWT-MYS-250", "Ghee Mysore Pak", "Silky Mysore pak made with pure ghee.", "289.00", 36, "/images/categories/sweets.svg"),
    product("LAD-001", "Motichoor Laddu", "Fine boondi pearls with saffron and pistachio.", "249.00", 45, "/images/categories/sweets.svg"),
    product("HAL-250", "Tirunelveli Halwa", "Glossy wheat halwa slow-cooked with ghee.", "279.00", 28, "/images/categories/sweets.svg"),
    product("SWT-BUR-220", "Tender Coconut Burfi", "Soft coconut squares with cardamom.", "239.00", 33, "/images/categories/sweets.svg"),
    product("SWT-PED-220", "Rose Milk Peda", "Creamy milk peda perfumed with rose.", "259.00", 40, "/images/categories/sweets.svg"),
    product("MIL-RAG-180", "Ragi Ribbon Pakoda", "Finger-millet ribbons with sesame and chilli.", "149.00", 46, "/images/categories/millet.svg"),
    product("MIL-KAM-180", "Kambu Murukku", "Pearl-millet spirals with cumin.", "145.00", 39, "/images/categories/millet.svg"),
    product("MIL-THI-200", "Thinai Jaggery Laddu", "Foxtail-millet laddus with jaggery and coconut.", "219.00", 35, "/images/categories/millet.svg"),
    product("MIL-THA-180", "Multigrain Thattai", "Grain crackers with lentils and curry leaf.", "155.00", 41, "/images/categories/millet.svg"),
    product("MIL-SAM-160", "Samai Seed Crunch", "Little-millet clusters with roasted seeds.", "169.00", 52, "/images/categories/millet.svg"),
    product("BAK-ROS-180", "Rose Cookies", "Traditional achu murukku with coconut milk.", "159.00", 34, "/images/rose-cookies.jpg"),
    product("BAK-NAN-200", "Cardamom Nankhatai", "Buttery Indian shortbread with pistachio.", "179.00", 47, "/images/categories/bakery.svg"),
    product("BAK-RUS-220", "Cardamom Tea Rusk", "Twice-baked rusks for chai.", "139.00", 61, "/images/categories/bakery.svg"),
    product("BAK-COC-180", "Coconut Macaroons", "Toasty coconut drops with a chewy centre.", "189.00", 29, "/images/categories/bakery.svg"),
    product("BAK-KHA-180", "Masala Khari", "Flaky pastry with cumin and fenugreek.", "169.00", 43, "/images/categories/bakery.svg"),
    product("GFT-TAS-900", "Heritage Taster Box", "Six iconic snacks in a keepsake box.", "899.00", 22, "/images/categories/gifting.svg"),
    product("GFT-FES-1600", "Festival Grand Hamper", "Ten festive favourites with premium wrapping.", "1599.00", 14, "/images/categories/gifting.svg"),
    product("GFT-TEA-700", "Tea-Time Pairing Box", "Six thoughtful pairings for a tea table.", "749.00", 27, "/images/categories/gifting.svg"),
    product("GFT-MIL-650", "Millet Discovery Box", "Five inventive millet snacks.", "699.00", 32, "/images/categories/gifting.svg"),
    product("GFT-COR-1800", "Corporate Joy Box", "A corporate-ready twelve-item hamper.", "1899.00", 18, "/images/categories/gifting.svg"),
]


async def seed_products(db: AsyncSession):
    """Insert missing catalog rows and refresh copy without resetting inventory."""
    result = await db.execute(select(Product))
    existing = {item.sku: item for item in result.scalars().all()}

    for data in SAMPLE_PRODUCTS:
        current = existing.get(data["sku"])
        if current:
            current.name = data["name"]
            current.description = data["description"]
            current.price = data["price"]
            current.image_url = data["image_url"]
            current.active = True
        else:
            db.add(Product(**data))

    await db.commit()
