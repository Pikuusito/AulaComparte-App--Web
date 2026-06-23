"""Add resource report reason."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260623_0006"
down_revision: str | None = "20260623_0005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("resources", sa.Column("report_reason", sa.String(length=1000), nullable=True))


def downgrade() -> None:
    op.drop_column("resources", "report_reason")
