from app.core.config import get_settings
from app.core.database import get_session_factory
from app.core.security import hash_password
from app.repositories.user_repository import UserRepository


def seed_moderator() -> None:
    settings = get_settings()
    password = settings.moderator_password.get_secret_value()
    if not password:
        raise RuntimeError("MODERATOR_PASSWORD must be configured before running the seed")

    with get_session_factory()() as session:
        repository = UserRepository(session)
        email = settings.moderator_email.strip().lower()
        if repository.get_by_email(email) is not None:
            print("Moderator already exists")
            return
        repository.create(
            name=settings.moderator_name.strip(),
            email=email,
            password_hash=hash_password(password),
            role="moderator",
        )
        print("Moderator created")


if __name__ == "__main__":
    seed_moderator()
