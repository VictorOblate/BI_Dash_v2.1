"""Initial baseline migration

This is a hand-authored baseline so Alembic has a valid starting point.
It intentionally contains no schema changes because the database was
initialized via SQLAlchemy's metadata.create_all() during setup.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "000000000000"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Baseline - no-op upgrade because tables were created via SQLAlchemy
    pass


def downgrade() -> None:
    # Downgrade is a no-op for baseline
    pass
