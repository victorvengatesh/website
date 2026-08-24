from math import asin, cos, radians, sin, sqrt

from app.core.config import settings


def haversine_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    earth_radius_km = 6371.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    )

    return round(
        2 * earth_radius_km * asin(sqrt(a)),
        2,
    )


def calculate_delivery_distance(
    latitude: float | None,
    longitude: float | None,
) -> float:
    if latitude is None or longitude is None:
        raise ValueError(
            "Precise location is required. Please allow location access during checkout."
        )

    return haversine_distance(
        settings.shop_lat,
        settings.shop_lng,
        latitude,
        longitude,
    )
