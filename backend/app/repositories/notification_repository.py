from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, notification: Notification) -> Notification:
        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)
        return notification

    def list_by_user(self, user_id: int) -> list[Notification]:
        statement = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc(), Notification.id.desc())
        )
        return list(self.session.scalars(statement))

    def get_for_user(self, notification_id: int, user_id: int) -> Notification | None:
        statement = select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        )
        return self.session.scalar(statement)

    def count_unread(self, user_id: int) -> int:
        statement = select(func.count()).select_from(Notification).where(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        return int(self.session.scalar(statement) or 0)

    def mark_read(self, notification: Notification) -> Notification:
        notification.is_read = True
        self.session.commit()
        self.session.refresh(notification)
        return notification

    def mark_all_read(self, user_id: int) -> None:
        statement = (
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read.is_(False))
            .values(is_read=True)
        )
        self.session.execute(statement)
        self.session.commit()
