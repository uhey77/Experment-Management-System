import json
from functools import lru_cache
from typing import Any, List

from pydantic import Field
from pydantic.functional_validators import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """アプリ全体の設定値を保持するクラス。"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    project_name: str = Field(default="Experiment Management API")
    api_v1_prefix: str = Field(default="/api/v1")

    database_url: str | None = Field(default=None, alias="DATABASE_URL")
    postgres_host: str = Field(default="localhost", alias="POSTGRES_HOST")
    postgres_port: int = Field(default=5432, alias="POSTGRES_PORT")
    postgres_user: str = Field(default="postgres", alias="POSTGRES_USER")
    postgres_password: str = Field(default="postgres", alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(default="postgres", alias="POSTGRES_DB")

    secret_key: str = Field(default="change-me", alias="SECRET_KEY")
    cors_origins_raw: Any = Field(default=None, alias="BACKEND_CORS_ORIGINS")

    @field_validator("cors_origins_raw", mode="before")
    @classmethod
    def normalize_cors(cls, value: Any) -> Any:
        if value is None:
            return None
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return None
            if stripped.startswith("[") and stripped.endswith("]"):
                try:
                    return json.loads(stripped)
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in stripped.split(",") if origin.strip()]
        return value

    @property
    def sync_database_uri(self) -> str:
        if self.database_url:
            return self.database_url
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origins(self) -> List[str]:
        raw = self.cors_origins_raw
        if not raw:
            return ["http://localhost:5173"]
        if isinstance(raw, list):
            return raw
        if isinstance(raw, str):
            return [raw]
        return ["http://localhost:5173"]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


def reset_settings_cache() -> None:
    get_settings.cache_clear()
