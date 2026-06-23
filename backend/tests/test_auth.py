from collections.abc import Iterator
from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.api.auth import get_auth_service
from app.core.security import create_access_token, hash_password, verify_password
from app.main import app
from app.models.user import User
from app.schemas.auth import LoginResponse, UserResponse
from app.services.auth_service import EmailAlreadyRegisteredError, InvalidCredentialsError

USER = User(
    id=1,
    name="Usuario Demo",
    email="usuario@ejemplo.com",
    password_hash="unused",
    role="user",
    created_at=datetime.now(UTC).replace(tzinfo=None),
)


class FakeAuthService:
    def register(self, *, name: str, email: str, password: str) -> User:
        if email == "usuario@ejemplo.com":
            raise EmailAlreadyRegisteredError
        return USER

    def login(self, *, email: str, password: str) -> LoginResponse:
        if password != "ClaveDemo123":
            raise InvalidCredentialsError
        return LoginResponse(
            access_token=create_access_token(USER.id, USER.role),
            user=UserResponse.model_validate(USER),
        )

    def get_user(self, user_id: int) -> User | None:
        return USER if user_id == USER.id else None


@pytest.fixture
def client() -> Iterator[TestClient]:
    app.dependency_overrides[get_auth_service] = FakeAuthService
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_password_is_hashed_and_can_be_verified() -> None:
    stored_hash = hash_password("ClaveDemo123")

    assert stored_hash != "ClaveDemo123"
    assert verify_password("ClaveDemo123", stored_hash)
    assert not verify_password("incorrecta", stored_hash)


def test_register_user(client: TestClient) -> None:
    response = client.post(
        "/api/auth/register",
        json={"name": "Nueva persona", "email": "nuevo@ejemplo.com", "password": "ClaveDemo123"},
    )

    assert response.status_code == 201
    assert response.json()["role"] == "user"


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    response = client.post(
        "/api/auth/register",
        json={"name": "Usuario Demo", "email": "usuario@ejemplo.com", "password": "ClaveDemo123"},
    )

    assert response.status_code == 409


def test_login_and_get_current_user(client: TestClient) -> None:
    login_response = client.post(
        "/api/auth/login",
        json={"email": "usuario@ejemplo.com", "password": "ClaveDemo123"},
    )
    token = login_response.json()["access_token"]

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert login_response.status_code == 200
    assert response.status_code == 200
    assert response.json()["email"] == "usuario@ejemplo.com"


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": "usuario@ejemplo.com", "password": "incorrecta"},
    )

    assert response.status_code == 401


def test_me_requires_valid_token(client: TestClient) -> None:
    assert client.get("/api/auth/me").status_code == 401
    assert client.get(
        "/api/auth/me", headers={"Authorization": "Bearer invalid"}
    ).status_code == 401
