from app.repositories.database_repository import DatabaseRepository
from app.schemas.health import DatabaseHealthResponse, HealthResponse


class HealthService:
    def __init__(self, database_repository: DatabaseRepository) -> None:
        self.database_repository = database_repository

    def get_status(self) -> HealthResponse:
        return HealthResponse(status="ok")

    def get_database_status(self) -> DatabaseHealthResponse:
        is_available = self.database_repository.is_available()
        return DatabaseHealthResponse(
            status="ok" if is_available else "degraded",
            database="connected" if is_available else "unavailable",
        )
