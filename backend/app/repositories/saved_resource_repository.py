from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.resource import Resource
from app.models.saved_resource import SavedResource


class SavedResourceRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def exists(self, user_id: int, resource_id: int) -> bool:
        statement = select(SavedResource).where(
            SavedResource.user_id == user_id,
            SavedResource.resource_id == resource_id,
        )
        return self.session.scalar(statement) is not None

    def create(self, user_id: int, resource_id: int) -> SavedResource:
        saved_resource = SavedResource(user_id=user_id, resource_id=resource_id)
        self.session.add(saved_resource)
        self.session.commit()
        self.session.refresh(saved_resource)
        return saved_resource

    def delete(self, user_id: int, resource_id: int) -> bool:
        statement = delete(SavedResource).where(
            SavedResource.user_id == user_id,
            SavedResource.resource_id == resource_id,
        )
        result = self.session.execute(statement)
        self.session.commit()
        return (result.rowcount or 0) > 0

    def list_resources_by_user(self, user_id: int) -> list[Resource]:
        statement = (
            select(Resource)
            .join(SavedResource, SavedResource.resource_id == Resource.id)
            .where(SavedResource.user_id == user_id, Resource.status == "approved")
            .order_by(SavedResource.created_at.desc(), Resource.id.desc())
        )
        return list(self.session.scalars(statement))
