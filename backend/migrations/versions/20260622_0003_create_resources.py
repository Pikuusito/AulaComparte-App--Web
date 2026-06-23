"""Create resources table."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260622_0003"
down_revision: str | None = "20260622_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "resources",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("resource_type", sa.String(length=30), nullable=False),
        sa.Column("subject", sa.String(length=100), nullable=False),
        sa.Column("education_level", sa.String(length=30), nullable=False),
        sa.Column("format", sa.String(length=30), nullable=False),
        sa.Column("author", sa.String(length=120), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=True),
        sa.Column("external_url", sa.String(length=1000), nullable=True),
        sa.Column("material_reference", sa.String(length=500), nullable=True),
        sa.Column("page_count", sa.Integer(), nullable=True),
        sa.Column("image_count", sa.Integer(), nullable=True),
        sa.Column("permission_declared", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=20), server_default="pending", nullable=False),
        sa.Column("downloads", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("sysdatetime()"), nullable=False),
        sa.CheckConstraint("resource_type IN ('book', 'notes', 'guide', 'exercises', 'slides', 'exam')", name="ck_resources_type"),
        sa.CheckConstraint("education_level IN ('primary', 'secondary', 'preuniversity', 'university')", name="ck_resources_education_level"),
        sa.CheckConstraint("format IN ('pdf', 'image', 'document', 'link', 'physical')", name="ck_resources_format"),
        sa.CheckConstraint("status IN ('pending', 'approved', 'rejected')", name="ck_resources_status"),
        sa.CheckConstraint("downloads >= 0", name="ck_resources_downloads_nonnegative"),
        sa.CheckConstraint("page_count IS NULL OR page_count >= 0", name="ck_resources_page_count_nonnegative"),
        sa.CheckConstraint("image_count IS NULL OR image_count >= 0", name="ck_resources_image_count_nonnegative"),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_resources_owner_id", "resources", ["owner_id"])
    op.create_index("ix_resources_status", "resources", ["status"])
    op.create_index("ix_resources_created_at", "resources", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_resources_created_at", table_name="resources")
    op.drop_index("ix_resources_status", table_name="resources")
    op.drop_index("ix_resources_owner_id", table_name="resources")
    op.drop_table("resources")
