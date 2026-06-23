from collections.abc import Iterator
from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.api.auth import get_current_user, require_moderator
from app.api.notifications import get_notification_service
from app.api.resources import get_resource_service, get_saved_resource_service
from app.main import app
from app.models.notification import Notification
from app.models.resource import Resource
from app.models.user import User
from app.schemas.resource import ResourceCreate
from app.services.resource_service import ResourceNotFoundError
from app.services.saved_resource_service import SaveableResourceNotFoundError
from app.services.notification_service import NotificationNotFoundError
from fastapi import UploadFile

NOW = datetime.now(UTC).replace(tzinfo=None)
USER = User(id=1, name="Usuario Demo", email="usuario@ejemplo.com", password_hash="unused", role="user", created_at=NOW)
MODERATOR = User(id=2, name="Moderador", email="moderador@ejemplo.com", password_hash="unused", role="moderator", created_at=NOW)


def make_resource(*, resource_id: int = 1, status: str = "pending", report_reason: str | None = None) -> Resource:
    return Resource(id=resource_id, owner_id=USER.id, title="Álgebra básica", description="Material introductorio de álgebra para estudiantes.", resource_type="guide", subject="Matemática", education_level="secondary", format="link", author="Docente Demo", file_path=None, external_url="https://example.com/algebra", material_reference=None, page_count=None, image_count=None, permission_declared=True, report_reason=report_reason, status=status, downloads=0, created_at=NOW)


class FakeResourceService:
    searched_query: str | None = None
    searched_type: str | None = None

    def create(self, *, owner_id: int, payload: ResourceCreate, upload: UploadFile | None) -> Resource:
        assert owner_id == USER.id and payload.permission_declared
        assert upload is None
        return make_resource()

    def list_catalog(self) -> list[Resource]:
        return [make_resource(status="approved")]

    def search_catalog(self, query: str, resource_type: str | None = None) -> list[Resource]:
        self.searched_query = query
        self.searched_type = resource_type
        return [make_resource(status="approved")]

    def list_mine(self, owner_id: int) -> list[Resource]:
        assert owner_id == USER.id
        return [make_resource()]

    def list_pending(self) -> list[Resource]:
        return [make_resource()]

    def get_approved(self, resource_id: int) -> Resource:
        if resource_id != 1:
            raise ResourceNotFoundError
        return make_resource(status="approved")

    def register_download(self, resource_id: int) -> Resource:
        if resource_id != 1:
            raise ResourceNotFoundError
        resource = make_resource(status="approved")
        resource.downloads = 1
        return resource

    def record_download(self, resource: Resource) -> Resource:
        resource.downloads += 1
        return resource

    def moderate(self, resource_id: int, new_status: str) -> Resource:
        if resource_id != 1:
            raise ResourceNotFoundError
        return make_resource(status=new_status)

    def report(self, resource_id: int, reason: str) -> Resource:
        if resource_id != 1:
            raise ResourceNotFoundError
        return make_resource(status="reported", report_reason=reason)


class FakeSavedResourceService:
    def list_saved(self, user_id: int) -> list[Resource]:
        assert user_id == USER.id
        return [make_resource(status="approved")]

    def save(self, user_id: int, resource_id: int) -> Resource:
        assert user_id == USER.id
        if resource_id != 1:
            raise SaveableResourceNotFoundError
        return make_resource(status="approved")

    def unsave(self, user_id: int, resource_id: int) -> None:
        assert user_id == USER.id
        assert resource_id in {1, 999}


class FakeNotificationService:
    notifications: list[Notification] = []

    def __init__(self) -> None:
        if not self.notifications:
            self.notifications.append(
                Notification(
                    id=1,
                    user_id=USER.id,
                    resource_id=1,
                    title="Material aprobado",
                    message="Tu material fue aprobado.",
                    type="resource_approved",
                    is_read=False,
                    created_at=NOW,
                )
            )

    def notify_resource_approved(self, resource: Resource, moderator_comment: str | None = None) -> Notification:
        message = f"Tu material '{resource.title}' fue aprobado y ya está disponible en la biblioteca."
        if moderator_comment:
            message = f"{message} Comentario del moderador: {moderator_comment.strip()}"
        notification = Notification(
            id=len(self.notifications) + 1,
            user_id=resource.owner_id,
            resource_id=resource.id,
            title="Material aprobado",
            message=message,
            type="resource_approved",
            is_read=False,
            created_at=NOW,
        )
        self.notifications.append(notification)
        return notification

    def notify_resource_rejected(self, resource: Resource, moderator_comment: str | None = None) -> Notification:
        message = f"Tu material '{resource.title}' fue rechazado por el moderador."
        if moderator_comment:
            message = f"{message} Comentario del moderador: {moderator_comment.strip()}"
        notification = Notification(
            id=len(self.notifications) + 1,
            user_id=resource.owner_id,
            resource_id=resource.id,
            title="Material rechazado",
            message=message,
            type="resource_rejected",
            is_read=False,
            created_at=NOW,
        )
        self.notifications.append(notification)
        return notification

    def list_for_user(self, user_id: int) -> list[Notification]:
        return [notification for notification in self.notifications if notification.user_id == user_id]

    def count_unread(self, user_id: int) -> int:
        return len([notification for notification in self.notifications if notification.user_id == user_id and not notification.is_read])

    def mark_read(self, notification_id: int, user_id: int) -> Notification:
        for notification in self.notifications:
            if notification.id == notification_id and notification.user_id == user_id:
                notification.is_read = True
                return notification
        raise NotificationNotFoundError

    def mark_all_read(self, user_id: int) -> None:
        for notification in self.notifications:
            if notification.user_id == user_id:
                notification.is_read = True


@pytest.fixture
def client() -> Iterator[TestClient]:
    FakeNotificationService.notifications = []
    app.dependency_overrides[get_current_user] = lambda: USER
    app.dependency_overrides[require_moderator] = lambda: MODERATOR
    app.dependency_overrides[get_resource_service] = FakeResourceService
    app.dependency_overrides[get_saved_resource_service] = FakeSavedResourceService
    app.dependency_overrides[get_notification_service] = FakeNotificationService
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def valid_payload() -> dict[str, object]:
    return {"title": "Álgebra básica", "description": "Material introductorio de álgebra para estudiantes.", "resource_type": "guide", "subject": "Matemática", "education_level": "secondary", "format": "link", "author": "Docente Demo", "external_url": "https://example.com/algebra", "permission_declared": True}


def test_create_resource_starts_pending(client: TestClient) -> None:
    response = client.post("/api/resources", data=valid_payload())
    assert response.status_code == 201, response.text
    assert response.json()["status"] == "pending"


def test_link_requires_external_url(client: TestClient) -> None:
    payload = valid_payload()
    del payload["external_url"]
    assert client.post("/api/resources", data=payload).status_code == 422


def test_catalog_and_detail_return_approved_resources(client: TestClient) -> None:
    catalog = client.get("/api/resources")
    detail = client.get("/api/resources/1")
    assert catalog.status_code == 200
    assert catalog.json()[0]["status"] == "approved"
    assert detail.status_code == 200


def test_search_approved_resources_with_optional_type_filter(client: TestClient) -> None:
    response = client.get("/api/resources/search", params={"q": "algebra", "resource_type": "guide"})

    assert response.status_code == 200
    assert response.json()[0]["status"] == "approved"


def test_download_redirects_external_resource(client: TestClient) -> None:
    response = client.get("/api/resources/1/download", follow_redirects=False)

    assert response.status_code == 302
    assert response.headers["location"] == "https://example.com/algebra"


def test_owner_can_list_own_pending_resources(client: TestClient) -> None:
    response = client.get("/api/resources/mine")
    assert response.status_code == 200
    assert response.json()[0]["status"] == "pending"


def test_moderator_can_approve_resource(client: TestClient) -> None:
    response = client.patch(
        "/api/resources/1/status",
        json={"status": "approved", "moderator_comment": "Buen aporte para la biblioteca."},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "approved"

    notifications = client.get("/api/notifications").json()
    assert notifications[-1]["title"] == "Material aprobado"
    assert "Buen aporte para la biblioteca." in notifications[-1]["message"]


def test_moderator_can_reject_resource_with_notification(client: TestClient) -> None:
    response = client.patch(
        "/api/resources/1/status",
        json={"status": "rejected", "moderator_comment": "Falta citar la fuente del material."},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "rejected"

    notifications = client.get("/api/notifications").json()
    assert notifications[-1]["title"] == "Material rechazado"
    assert notifications[-1]["type"] == "resource_rejected"
    assert "Falta citar la fuente del material." in notifications[-1]["message"]


def test_user_can_read_notifications(client: TestClient) -> None:
    assert client.get("/api/notifications/unread-count").json()["unread_count"] == 1

    response = client.get("/api/notifications")
    assert response.status_code == 200
    assert response.json()[0]["is_read"] is False

    read_response = client.patch("/api/notifications/1/read")
    assert read_response.status_code == 200
    assert read_response.json()["is_read"] is True
    assert client.get("/api/notifications/unread-count").json()["unread_count"] == 0


def test_user_can_mark_all_notifications_read(client: TestClient) -> None:
    response = client.patch("/api/notifications/read-all")

    assert response.status_code == 204
    assert client.get("/api/notifications/unread-count").json()["unread_count"] == 0


def test_user_can_list_saved_resources(client: TestClient) -> None:
    response = client.get("/api/resources/saved")
    assert response.status_code == 200
    assert response.json()[0]["status"] == "approved"


def test_user_can_save_and_unsave_approved_resource(client: TestClient) -> None:
    save_response = client.post("/api/resources/1/save")
    unsave_response = client.delete("/api/resources/1/save")

    assert save_response.status_code == 200
    assert save_response.json()["id"] == 1
    assert unsave_response.status_code == 204


def test_user_can_report_approved_resource(client: TestClient) -> None:
    response = client.post("/api/resources/1/report", json={"reason": "El material contiene información incorrecta."})

    assert response.status_code == 200
    assert response.json()["status"] == "reported"
    assert response.json()["report_reason"] == "El material contiene información incorrecta."


def test_report_requires_reason(client: TestClient) -> None:
    response = client.post("/api/resources/1/report", json={"reason": "Muy corto"})

    assert response.status_code == 422


def test_user_cannot_save_missing_or_unapproved_resource(client: TestClient) -> None:
    response = client.post("/api/resources/999/save")
    assert response.status_code == 404


def test_resource_not_found(client: TestClient) -> None:
    assert client.get("/api/resources/999").status_code == 404
    assert client.patch("/api/resources/999/status", json={"status": "rejected"}).status_code == 404
