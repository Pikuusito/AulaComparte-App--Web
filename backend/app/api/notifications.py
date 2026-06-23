from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_session
from app.models.notification import Notification
from app.models.user import User
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationResponse, NotificationUnreadCountResponse
from app.services.notification_service import NotificationNotFoundError, NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])


def get_notification_service(session: Annotated[Session, Depends(get_session)]) -> NotificationService:
    return NotificationService(NotificationRepository(session))


@router.get("", response_model=list[NotificationResponse])
def list_notifications(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NotificationService, Depends(get_notification_service)],
) -> list[Notification]:
    return service.list_for_user(user.id)


@router.get("/unread-count", response_model=NotificationUnreadCountResponse)
def get_unread_count(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NotificationService, Depends(get_notification_service)],
) -> NotificationUnreadCountResponse:
    return NotificationUnreadCountResponse(unread_count=service.count_unread(user.id))


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NotificationService, Depends(get_notification_service)],
) -> Notification:
    try:
        return service.mark_read(notification_id, user.id)
    except NotificationNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found") from None


@router.patch("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_notifications_read(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NotificationService, Depends(get_notification_service)],
) -> None:
    service.mark_all_read(user.id)
