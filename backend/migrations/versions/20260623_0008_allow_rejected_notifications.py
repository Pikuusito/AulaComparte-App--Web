"""Allow rejected resource notifications."""

from collections.abc import Sequence

from alembic import op

revision: str = "20260623_0008"
down_revision: str | None = "20260623_0007"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint("ck_notifications_type", "notifications", type_="check")
    op.create_check_constraint(
        "ck_notifications_type",
        "notifications",
        "type IN ('resource_approved', 'resource_rejected')",
    )


def downgrade() -> None:
    op.execute("DELETE FROM notifications WHERE type = 'resource_rejected'")
    op.drop_constraint("ck_notifications_type", "notifications", type_="check")
    op.create_check_constraint(
        "ck_notifications_type",
        "notifications",
        "type IN ('resource_approved')",
    )
