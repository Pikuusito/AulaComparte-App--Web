from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_engine


class DatabaseRepository:
    def is_available(self) -> bool:
        try:
            with get_engine().connect() as connection:
                connection.execute(text("SELECT 1"))
            return True
        except (SQLAlchemyError, RuntimeError):
            return False
