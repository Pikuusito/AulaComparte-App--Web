from sqlalchemy.exc import IntegrityError

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginResponse, UserResponse


class EmailAlreadyRegisteredError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class AuthService:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def register(self, *, name: str, email: str, password: str) -> User:
        normalized_email = email.strip().lower()
        if self.user_repository.get_by_email(normalized_email) is not None:
            raise EmailAlreadyRegisteredError
        try:
            return self.user_repository.create(
                name=name.strip(),
                email=normalized_email,
                password_hash=hash_password(password),
                role="user",
            )
        except IntegrityError as error:
            raise EmailAlreadyRegisteredError from error

    def login(self, *, email: str, password: str) -> LoginResponse:
        user = self.user_repository.get_by_email(email.strip().lower())
        if user is None or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError
        return LoginResponse(
            access_token=create_access_token(user.id, user.role),
            user=UserResponse.model_validate(user),
        )

    def get_user(self, user_id: int) -> User | None:
        return self.user_repository.get_by_id(user_id)
