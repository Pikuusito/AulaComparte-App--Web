from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Resource(Base):
    __tablename__ = "resources"
    __table_args__ = (
        CheckConstraint(
            "resource_type IN ('book', 'notes', 'guide', 'exercises', 'slides', 'exam')",
            name="ck_resources_type",
        ),
        CheckConstraint(
            "education_level IN ('primary', 'secondary', 'preuniversity', 'university')",
            name="ck_resources_education_level",
        ),
        CheckConstraint(
            "format IN ('pdf', 'image', 'document', 'link', 'physical')",
            name="ck_resources_format",
        ),
        CheckConstraint(
            "status IN ('pending', 'approved', 'rejected', 'reported')",
            name="ck_resources_status",
        ),
        CheckConstraint("downloads >= 0", name="ck_resources_downloads_nonnegative"),
        CheckConstraint("page_count IS NULL OR page_count >= 0", name="ck_resources_page_count_nonnegative"),
        CheckConstraint("image_count IS NULL OR image_count >= 0", name="ck_resources_image_count_nonnegative"),
        Index("ix_resources_owner_id", "owner_id"),
        Index("ix_resources_status", "status"),
        Index("ix_resources_created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String(), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(30), nullable=False)
    subject: Mapped[str] = mapped_column(String(100), nullable=False)
    education_level: Mapped[str] = mapped_column(String(30), nullable=False)
    format: Mapped[str] = mapped_column(String(30), nullable=False)
    author: Mapped[str] = mapped_column(String(120), nullable=False)
    file_path: Mapped[str | None] = mapped_column(String(500))
    external_url: Mapped[str | None] = mapped_column(String(1000))
    material_reference: Mapped[str | None] = mapped_column(String(500))
    page_count: Mapped[int | None] = mapped_column(Integer)
    image_count: Mapped[int | None] = mapped_column(Integer)
    permission_declared: Mapped[bool] = mapped_column(nullable=False)
    report_reason: Mapped[str | None] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    downloads: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(), server_default=func.sysdatetime(), nullable=False)
