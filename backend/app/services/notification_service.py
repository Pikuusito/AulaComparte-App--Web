from app.models.notification import Notification
from app.models.resource import Resource
from app.repositories.notification_repository import NotificationRepository


class NotificationNotFoundError(Exception):
    pass


class NotificationService:
    def __init__(self, repository: NotificationRepository) -> None:
        self.repository = repository

    def notify_resource_approved(self, resource: Resource, moderator_comment: str | None = None) -> Notification:
        comment = moderator_comment.strip() if moderator_comment else ""
        message = f"Tu material '{resource.title}' fue aprobado y ya está disponible en la biblioteca."

        if comment:
            message = f"{message} Comentario del moderador: {comment}"

        return self.repository.create(
            Notification(
                user_id=resource.owner_id,
                resource_id=resource.id,
                title="Material aprobado",
                message=message,
                type="resource_approved",
                is_read=False,
            )
        )

    def notify_resource_rejected(self, resource: Resource, moderator_comment: str | None = None) -> Notification:
        comment = moderator_comment.strip() if moderator_comment else ""
        message = f"Tu material '{resource.title}' fue rechazado por el moderador."

        if comment:
            message = f"{message} Comentario del moderador: {comment}"

        return self.repository.create(
            Notification(
                user_id=resource.owner_id,
                resource_id=resource.id,
                title="Material rechazado",
                message=message,
                type="resource_rejected",
                is_read=False,
            )
        )

    def list_for_user(self, user_id: int) -> list[Notification]:
        return self.repository.list_by_user(user_id)

    def count_unread(self, user_id: int) -> int:
        return self.repository.count_unread(user_id)

    def mark_read(self, notification_id: int, user_id: int) -> Notification:
        notification = self.repository.get_for_user(notification_id, user_id)

        if notification is None:
            raise NotificationNotFoundError

        return self.repository.mark_read(notification)

    def mark_all_read(self, user_id: int) -> None:
        self.repository.mark_all_read(user_id)
