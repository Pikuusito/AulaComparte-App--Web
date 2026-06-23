"""Create saved_resources table."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260622_0004"
down_revision: str | None = "20260622_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "saved_resources",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("resource_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("sysdatetime()"), nullable=False),
        sa.ForeignKeyConstraint(["resource_id"], ["resources.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("user_id", "resource_id"),
    )
    op.create_index("ix_saved_resources_user_id", "saved_resources", ["user_id"])
    op.create_index("ix_saved_resources_resource_id", "saved_resources", ["resource_id"])


def downgrade() -> None:
    op.drop_index("ix_saved_resources_resource_id", table_name="saved_resources")
    op.drop_index("ix_saved_resources_user_id", table_name="saved_resources")
    op.drop_table("saved_resources")
