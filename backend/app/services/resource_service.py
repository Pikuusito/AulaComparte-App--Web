from fastapi import UploadFile

from app.models.resource import Resource
from app.repositories.resource_repository import ResourceRepository
from app.schemas.resource import ResourceCreate, ResourceStatus, ResourceType
from app.services.file_storage_service import FileStorageService


class ResourceNotFoundError(Exception):
    pass


class ResourceFileNotFoundError(Exception):
    pass


class ResourceService:
    def __init__(self, repository: ResourceRepository, file_storage: FileStorageService) -> None:
        self.repository = repository
        self.file_storage = file_storage

    def create(self, *, owner_id: int, payload: ResourceCreate, upload: UploadFile | None) -> Resource:
        values = payload.model_dump(mode="json")
        file_path = self.file_storage.save(upload, payload.format)
        try:
            return self.repository.create(
                Resource(owner_id=owner_id, file_path=file_path, status="pending", downloads=0, **values)
            )
        except Exception:
            self.file_storage.delete(file_path)
            raise

    def list_catalog(self) -> list[Resource]:
        return self.repository.list_approved()

    def search_catalog(self, query: str, resource_type: ResourceType | None = None) -> list[Resource]:
        return self.repository.search_approved(query, resource_type)

    def list_mine(self, owner_id: int) -> list[Resource]:
        return self.repository.list_by_owner(owner_id)

    def list_pending(self) -> list[Resource]:
        return self.repository.list_pending()

    def get_approved(self, resource_id: int) -> Resource:
        resource = self.repository.get_by_id(resource_id)
        if resource is None or resource.status != "approved":
            raise ResourceNotFoundError
        return resource

    def register_download(self, resource_id: int) -> Resource:
        resource = self.get_approved(resource_id)
        return self.repository.increment_downloads(resource)

    def record_download(self, resource: Resource) -> Resource:
        return self.repository.increment_downloads(resource)

    def moderate(self, resource_id: int, new_status: ResourceStatus) -> Resource:
        resource = self.repository.get_by_id(resource_id)
        if resource is None:
            raise ResourceNotFoundError
        return self.repository.update_status(resource, new_status)

    def report(self, resource_id: int, reason: str) -> Resource:
        resource = self.repository.get_by_id(resource_id)
        if resource is None or resource.status != "approved":
            raise ResourceNotFoundError
        return self.repository.report(resource, reason.strip())
