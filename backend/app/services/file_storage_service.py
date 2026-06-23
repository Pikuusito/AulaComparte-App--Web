from pathlib import Path
from shutil import copyfileobj
from uuid import uuid4

from fastapi import UploadFile


class InvalidResourceFileError(Exception):
    pass


class ResourceFileRequiredError(Exception):
    pass


class FileStorageService:
    _allowed_extensions: dict[str, set[str]] = {
        "pdf": {".pdf"},
        "image": {".gif", ".jpeg", ".jpg", ".png", ".webp"},
        "document": {".doc", ".docx", ".odp", ".ods", ".odt", ".ppt", ".pptx", ".xls", ".xlsx"},
    }

    def __init__(self, storage_directory: Path, max_size_bytes: int) -> None:
        self.storage_directory = storage_directory
        self.max_size_bytes = max_size_bytes

    def save(self, upload: UploadFile | None, resource_format: str) -> str | None:
        if resource_format in {"link", "physical"}:
            if upload is not None:
                raise InvalidResourceFileError("This resource format does not accept a file")
            return None
        if upload is None or not upload.filename:
            raise ResourceFileRequiredError("A file is required for this resource format")

        extension = Path(upload.filename).suffix.lower()
        if extension not in self._allowed_extensions[resource_format]:
            raise InvalidResourceFileError(f"File extension {extension or '(none)'} is not allowed")

        upload.file.seek(0, 2)
        size = upload.file.tell()
        upload.file.seek(0)
        if size <= 0:
            raise InvalidResourceFileError("The uploaded file is empty")
        if size > self.max_size_bytes:
            raise InvalidResourceFileError("The uploaded file exceeds the allowed size")

        self.storage_directory.mkdir(parents=True, exist_ok=True)
        destination = self.storage_directory / f"{uuid4().hex}{extension}"
        with destination.open("wb") as stored_file:
            copyfileobj(upload.file, stored_file)
        return f"storage/{destination.name}"

    def delete(self, relative_path: str | None) -> None:
        if relative_path is None:
            return
        candidate = (self.storage_directory.parent / relative_path).resolve()
        if candidate.parent == self.storage_directory.resolve():
            candidate.unlink(missing_ok=True)

    def resolve(self, relative_path: str | None) -> Path | None:
        if relative_path is None:
            return None

        candidate = (self.storage_directory.parent / relative_path).resolve()
        if candidate.parent != self.storage_directory.resolve():
            return None

        return candidate
