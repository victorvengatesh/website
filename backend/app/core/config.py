from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./snackshop.db"
    frontend_origin: str = "http://localhost:5173"

    shop_lat: float = 10.9601
    shop_lng: float = 78.0766

    max_delivery_distance_km: float = 15.0

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
