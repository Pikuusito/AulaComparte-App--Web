from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=REPOSITORY_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AulaComparte API"
    app_env: Literal["development", "test", "production"] = "development"
    cors_origins: str = "http://localhost:4200"
    db_host: str = "localhost"
    db_port: int = 1433
    db_name: str = "AulaComparte"
    db_user: str = "sa"
    db_password: SecretStr = SecretStr("")
    db_driver: str = "ODBC Driver 18 for SQL Server"
    db_trust_server_certificate: bool = True
    jwt_secret_key: SecretStr = SecretStr("")
    jwt_expiration_hours: int = 8
    moderator_name: str = "Moderador AulaComparte"
    moderator_email: str = "moderador@aulacomparte.edu.pe"
    moderator_password: SecretStr = SecretStr("")
    storage_directory: Path = REPOSITORY_ROOT / "backend" / "storage"
    max_upload_size_mb: int = 20

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def database_url(self) -> URL:
        password = self.db_password.get_secret_value()
        if not password:
            raise RuntimeError("DB_PASSWORD must be configured before using the database")

        return URL.create(
            drivername="mssql+pyodbc",
            username=self.db_user,
            password=password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
            query={
                "driver": self.db_driver,
                "TrustServerCertificate": (
                    "yes" if self.db_trust_server_certificate else "no"
                ),
            },
        )

    @property
    def jwt_secret(self) -> str:
        secret = self.jwt_secret_key.get_secret_value()
        if not secret:
            raise RuntimeError("JWT_SECRET_KEY must be configured before using authentication")
        return secret


@lru_cache
def get_settings() -> Settings:
    return Settings()
