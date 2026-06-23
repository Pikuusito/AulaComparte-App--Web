"""Allow reported resources."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260623_0005"
down_revision: str | None = "20260622_0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint("ck_resources_status", "resources", type_="check")
    op.create_check_constraint(
        "ck_resources_status",
        "resources",
        "status IN ('pending', 'approved', 'rejected', 'reported')",
    )


def downgrade() -> None:
    op.execute(sa.text("UPDATE resources SET status = 'rejected' WHERE status = 'reported'"))
    op.drop_constraint("ck_resources_status", "resources", type_="check")
    op.create_check_constraint(
        "ck_resources_status",
        "resources",
        "status IN ('pending', 'approved', 'rejected')",
    )
