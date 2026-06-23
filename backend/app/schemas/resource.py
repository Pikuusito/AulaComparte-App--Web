from datetime import datetime
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator, model_validator

ResourceType = Literal["book", "notes", "guide", "exercises", "slides", "exam"]
EducationLevel = Literal["primary", "secondary", "preuniversity", "university"]
ResourceFormat = Literal["pdf", "image", "document", "link", "physical"]
ResourceStatus = Literal["pending", "approved", "rejected", "reported"]


class ResourceCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10, max_length=5000)
    resource_type: ResourceType
    subject: str = Field(min_length=2, max_length=100)
    education_level: EducationLevel
    format: ResourceFormat
    author: str = Field(min_length=2, max_length=120)
    external_url: HttpUrl | None = None
    material_reference: str | None = Field(default=None, max_length=500)
    page_count: int | None = Field(default=None, ge=0)
    image_count: int | None = Field(default=None, ge=0)
    permission_declared: bool

    @model_validator(mode="after")
    def validate_location_and_permission(self) -> Self:
        if not self.permission_declared:
            raise ValueError("Permission to share the resource must be declared")
        if self.format == "link":
            if self.external_url is None:
                raise ValueError("external_url is required for link resources")
            if self.material_reference:
                raise ValueError("Link resources only accept external_url")
        elif self.format == "physical":
            if not self.material_reference or not self.material_reference.strip():
                raise ValueError("material_reference is required for physical resources")
            if self.external_url:
                raise ValueError("Physical resources only accept material_reference")
        else:
            if self.external_url or self.material_reference:
                raise ValueError("Uploaded resources do not accept an external location")
        return self


class ResourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    title: str
    description: str
    resource_type: ResourceType
    subject: str
    education_level: EducationLevel
    format: ResourceFormat
    author: str
    file_path: str | None
    external_url: HttpUrl | None
    material_reference: str | None
    page_count: int | None
    image_count: int | None
    permission_declared: bool
    report_reason: str | None
    status: ResourceStatus
    downloads: int
    created_at: datetime


class ResourceStatusUpdate(BaseModel):
    status: Literal["approved", "rejected"]
    moderator_comment: str | None = Field(default=None, max_length=1000)

    @field_validator("moderator_comment")
    @classmethod
    def normalize_moderator_comment(cls, value: str | None) -> str | None:
        if value is None:
            return None

        comment = value.strip()
        return comment or None


class ResourceReportRequest(BaseModel):
    reason: str = Field(min_length=10, max_length=1000)

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, value: str) -> str:
        reason = value.strip()
        if len(reason) < 10:
            raise ValueError("Report reason must contain at least 10 non-blank characters")
        return reason
