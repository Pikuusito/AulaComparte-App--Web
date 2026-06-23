from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class SavedResource(Base):
    __tablename__ = "saved_resources"
    __table_args__ = (
        Index("ix_saved_resources_user_id", "user_id"),
        Index("ix_saved_resources_resource_id", "resource_id"),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("resources.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), server_default=func.sysdatetime(), nullable=False)
