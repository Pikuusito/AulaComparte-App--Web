from app.models.resource import Resource
from app.repositories.resource_repository import ResourceRepository
from app.repositories.saved_resource_repository import SavedResourceRepository


class SaveableResourceNotFoundError(Exception):
    pass


class SavedResourceService:
    def __init__(
        self,
        saved_repository: SavedResourceRepository,
        resource_repository: ResourceRepository,
    ) -> None:
        self.saved_repository = saved_repository
        self.resource_repository = resource_repository

    def list_saved(self, user_id: int) -> list[Resource]:
        return self.saved_repository.list_resources_by_user(user_id)

    def save(self, user_id: int, resource_id: int) -> Resource:
        resource = self.resource_repository.get_by_id(resource_id)
        if resource is None or resource.status != "approved":
            raise SaveableResourceNotFoundError

        if not self.saved_repository.exists(user_id, resource_id):
            self.saved_repository.create(user_id, resource_id)

        return resource

    def unsave(self, user_id: int, resource_id: int) -> None:
        self.saved_repository.delete(user_id, resource_id)
