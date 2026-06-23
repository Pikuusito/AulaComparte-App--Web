from sqlalchemy import case, func, or_, select
from sqlalchemy.orm import Session

from app.models.resource import Resource


class ResourceRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, resource: Resource) -> Resource:
        self.session.add(resource)
        self.session.commit()
        self.session.refresh(resource)
        return resource

    def get_by_id(self, resource_id: int) -> Resource | None:
        return self.session.get(Resource, resource_id)

    def list_approved(self) -> list[Resource]:
        statement = select(Resource).where(Resource.status == "approved").order_by(Resource.created_at.desc(), Resource.id.desc())
        return list(self.session.scalars(statement))

    def search_approved(self, query: str, resource_type: str | None = None) -> list[Resource]:
        normalized_query = f"%{query.strip().lower()}%"
        conditions = [
            Resource.status == "approved",
            or_(
                func.lower(Resource.title).like(normalized_query),
                func.lower(Resource.description).like(normalized_query),
                func.lower(Resource.subject).like(normalized_query),
                func.lower(Resource.author).like(normalized_query),
            ),
        ]

        if resource_type:
            conditions.append(Resource.resource_type == resource_type)

        statement = (
            select(Resource)
            .where(*conditions)
            .order_by(Resource.created_at.desc(), Resource.id.desc())
        )
        return list(self.session.scalars(statement))

    def list_by_owner(self, owner_id: int) -> list[Resource]:
        statement = select(Resource).where(Resource.owner_id == owner_id).order_by(Resource.created_at.desc(), Resource.id.desc())
        return list(self.session.scalars(statement))

    def list_pending(self) -> list[Resource]:
        priority = case(
            (Resource.status == "reported", 0),
            else_=1,
        )
        statement = (
            select(Resource)
            .where(Resource.status.in_(["pending", "reported"]))
            .order_by(priority, Resource.created_at.asc(), Resource.id.asc())
        )
        return list(self.session.scalars(statement))

    def update_status(self, resource: Resource, new_status: str) -> Resource:
        resource.status = new_status
        self.session.commit()
        self.session.refresh(resource)
        return resource

    def report(self, resource: Resource, reason: str) -> Resource:
        resource.status = "reported"
        resource.report_reason = reason
        self.session.commit()
        self.session.refresh(resource)
        return resource

    def increment_downloads(self, resource: Resource) -> Resource:
        resource.downloads += 1
        self.session.commit()
        self.session.refresh(resource)
        return resource
