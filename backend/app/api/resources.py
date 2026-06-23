from typing import Annotated
from mimetypes import guess_type
from pathlib import Path
from re import sub

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.api.auth import get_current_user, require_moderator
from app.core.config import get_settings
from app.core.database import get_session
from app.models.resource import Resource
from app.models.user import User
from app.repositories.resource_repository import ResourceRepository
from app.repositories.saved_resource_repository import SavedResourceRepository
from app.api.notifications import get_notification_service
from app.schemas.resource import (
    EducationLevel,
    ResourceCreate,
    ResourceFormat,
    ResourceReportRequest,
    ResourceResponse,
    ResourceStatusUpdate,
    ResourceType,
)
from app.services.resource_service import ResourceNotFoundError, ResourceService
from app.services.notification_service import NotificationService
from app.services.saved_resource_service import SaveableResourceNotFoundError, SavedResourceService
from app.services.file_storage_service import (
    FileStorageService,
    InvalidResourceFileError,
    ResourceFileRequiredError,
)

router = APIRouter(prefix="/resources", tags=["resources"])


def _download_filename(resource: Resource, path: Path) -> str:
    safe_title = sub(r"[^A-Za-z0-9._-]+", "_", resource.title).strip("._-")
    return f"{safe_title or 'recurso'}{path.suffix.lower()}"


def get_resource_service(session: Annotated[Session, Depends(get_session)]) -> ResourceService:
    settings = get_settings()
    return ResourceService(
        ResourceRepository(session),
        FileStorageService(
            settings.storage_directory,
            settings.max_upload_size_mb * 1024 * 1024,
        ),
    )


def get_saved_resource_service(session: Annotated[Session, Depends(get_session)]) -> SavedResourceService:
    return SavedResourceService(
        SavedResourceRepository(session),
        ResourceRepository(session),
    )


@router.post("", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
def create_resource(
    title: Annotated[str, Form(min_length=3, max_length=200)],
    description: Annotated[str, Form(min_length=10, max_length=5000)],
    resource_type: Annotated[ResourceType, Form()],
    subject: Annotated[str, Form(min_length=2, max_length=100)],
    education_level: Annotated[EducationLevel, Form()],
    format: Annotated[ResourceFormat, Form()],
    author: Annotated[str, Form(min_length=2, max_length=120)],
    permission_declared: Annotated[bool, Form()],
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ResourceService, Depends(get_resource_service)],
    external_url: Annotated[str | None, Form(max_length=1000)] = None,
    material_reference: Annotated[str | None, Form(max_length=500)] = None,
    page_count: Annotated[int | None, Form(ge=0)] = None,
    image_count: Annotated[int | None, Form(ge=0)] = None,
    file: Annotated[UploadFile | None, File()] = None,
) -> Resource:
    try:
        payload = ResourceCreate(
            title=title,
            description=description,
            resource_type=resource_type,
            subject=subject,
            education_level=education_level,
            format=format,
            author=author,
            external_url=external_url,
            material_reference=material_reference,
            page_count=page_count,
            image_count=image_count,
            permission_declared=permission_declared,
        )
        return service.create(owner_id=user.id, payload=payload, upload=file)
    except (InvalidResourceFileError, ResourceFileRequiredError) as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(error)) from None
    except ValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=error.errors(include_context=False),
        ) from None


@router.get("", response_model=list[ResourceResponse])
def list_catalog(service: Annotated[ResourceService, Depends(get_resource_service)]) -> list[Resource]:
    return service.list_catalog()


@router.get("/mine", response_model=list[ResourceResponse])
def list_my_resources(user: Annotated[User, Depends(get_current_user)], service: Annotated[ResourceService, Depends(get_resource_service)]) -> list[Resource]:
    return service.list_mine(user.id)


@router.get("/pending", response_model=list[ResourceResponse])
def list_pending_resources(_moderator: Annotated[User, Depends(require_moderator)], service: Annotated[ResourceService, Depends(get_resource_service)]) -> list[Resource]:
    return service.list_pending()


@router.get("/saved", response_model=list[ResourceResponse])
def list_saved_resources(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[SavedResourceService, Depends(get_saved_resource_service)],
) -> list[Resource]:
    return service.list_saved(user.id)


@router.get("/search", response_model=list[ResourceResponse])
def search_resources(
    service: Annotated[ResourceService, Depends(get_resource_service)],
    q: Annotated[str, Query(min_length=1, max_length=120)],
    resource_type: Annotated[ResourceType | None, Query()] = None,
) -> list[Resource]:
    return service.search_catalog(q, resource_type)


@router.post("/{resource_id}/save", response_model=ResourceResponse)
def save_resource(
    resource_id: int,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[SavedResourceService, Depends(get_saved_resource_service)],
) -> Resource:
    try:
        return service.save(user.id, resource_id)
    except SaveableResourceNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approved resource not found") from None


@router.delete("/{resource_id}/save", status_code=status.HTTP_204_NO_CONTENT)
def unsave_resource(
    resource_id: int,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[SavedResourceService, Depends(get_saved_resource_service)],
) -> None:
    service.unsave(user.id, resource_id)


@router.post("/{resource_id}/report", response_model=ResourceResponse)
def report_resource(
    resource_id: int,
    payload: ResourceReportRequest,
    _user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ResourceService, Depends(get_resource_service)],
) -> Resource:
    try:
        return service.report(resource_id, payload.reason)
    except ResourceNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approved resource not found") from None


@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, service: Annotated[ResourceService, Depends(get_resource_service)]) -> Resource:
    try:
        return service.get_approved(resource_id)
    except ResourceNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found") from None


@router.get("/{resource_id}/download", response_model=None)
def download_resource(resource_id: int, service: Annotated[ResourceService, Depends(get_resource_service)]) -> FileResponse | RedirectResponse:
    try:
        resource = service.get_approved(resource_id)
    except ResourceNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found") from None

    if resource.external_url:
        service.record_download(resource)
        return RedirectResponse(str(resource.external_url), status_code=status.HTTP_302_FOUND)

    path = service.file_storage.resolve(resource.file_path)
    if path is None or not path.exists() or not path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource file not found")

    service.record_download(resource)
    media_type = guess_type(path.name)[0] or "application/octet-stream"
    return FileResponse(path, media_type=media_type, filename=_download_filename(resource, path))


@router.patch("/{resource_id}/status", response_model=ResourceResponse)
def moderate_resource(
    resource_id: int,
    payload: ResourceStatusUpdate,
    _moderator: Annotated[User, Depends(require_moderator)],
    service: Annotated[ResourceService, Depends(get_resource_service)],
    notifications: Annotated[NotificationService, Depends(get_notification_service)],
) -> Resource:
    try:
        resource = service.moderate(resource_id, payload.status)

        if payload.status == "approved":
            notifications.notify_resource_approved(resource, payload.moderator_comment)

        if payload.status == "rejected":
            notifications.notify_resource_rejected(resource, payload.moderator_comment)

        return resource
    except ResourceNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found") from None
