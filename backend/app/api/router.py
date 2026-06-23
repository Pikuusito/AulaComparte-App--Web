from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.notifications import router as notifications_router
from app.api.resources import router as resources_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(resources_router)
api_router.include_router(notifications_router)
