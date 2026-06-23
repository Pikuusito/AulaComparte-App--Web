from fastapi import APIRouter

from app.repositories.database_repository import DatabaseRepository
from app.schemas.health import DatabaseHealthResponse, HealthResponse
from app.services.health_service import HealthService

router = APIRouter(tags=["health"])
health_service = HealthService(DatabaseRepository())


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return health_service.get_status()


@router.get("/health/database", response_model=DatabaseHealthResponse)
def database_health_check() -> DatabaseHealthResponse:
    return health_service.get_database_status()
