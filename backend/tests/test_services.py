from decimal import Decimal

import pytest
from pydantic import ValidationError

from app.schemas.order import OrderItemCreate
from app.services.distance_service import haversine_distance
from app.services.pricing_service import calculate_delivery_fee
from app.services.seed_service import SAMPLE_PRODUCTS


def test_haversine_returns_zero_for_identical_points():
    assert haversine_distance(10.9601, 78.0766, 10.9601, 78.0766) == 0


def test_haversine_is_symmetric_and_geographically_reasonable():
    forward = haversine_distance(0, 0, 0, 1)
    reverse = haversine_distance(0, 1, 0, 0)
    assert forward == reverse
    assert forward == pytest.approx(111.19, abs=0.1)


@pytest.mark.parametrize(
    ("distance", "expected"),
    [
        (0, Decimal("0.00")),
        (3, Decimal("0.00")),
        (3.01, Decimal("20.00")),
        (6, Decimal("20.00")),
        (6.01, Decimal("35.00")),
        (10, Decimal("35.00")),
        (10.01, Decimal("50.00")),
    ],
)
def test_delivery_fee_boundaries(distance, expected):
    assert calculate_delivery_fee(distance) == expected


def test_order_item_accepts_a_sku_without_a_database_id():
    item = OrderItemCreate(sku="MIX-100", quantity=2)
    assert item.sku == "MIX-100"
    assert item.product_id is None


def test_order_item_requires_a_product_reference():
    with pytest.raises(ValidationError):
        OrderItemCreate(quantity=1)


def test_seed_catalog_matches_the_frontend_contract():
    assert len(SAMPLE_PRODUCTS) == 30
    assert len({item["sku"] for item in SAMPLE_PRODUCTS}) == 30
    assert all(item["price"] > 0 for item in SAMPLE_PRODUCTS)
