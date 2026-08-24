from decimal import Decimal


def calculate_delivery_fee(distance_km: float) -> Decimal:
    """
    Simple MVP pricing rule.
    Change these values for the real shop.
    """
    if distance_km <= 3:
        return Decimal("0.00")
    if distance_km <= 6:
        return Decimal("20.00")
    if distance_km <= 10:
        return Decimal("35.00")
    return Decimal("50.00")
