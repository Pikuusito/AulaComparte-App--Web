from io import BytesIO
from pathlib import Path

import pytest
from fastapi import UploadFile

from app.services.file_storage_service import (
    FileStorageService,
    InvalidResourceFileError,
    ResourceFileRequiredError,
)


def make_upload(filename: str, content: bytes = b"file-content") -> UploadFile:
    return UploadFile(filename=filename, file=BytesIO(content))


def test_saves_file_with_generated_name(tmp_path: Path) -> None:
    service = FileStorageService(tmp_path / "storage", max_size_bytes=1024)

    relative_path = service.save(make_upload("material.pdf"), "pdf")

    assert relative_path is not None
    assert relative_path.startswith("storage/")
    assert relative_path.endswith(".pdf")
    assert (tmp_path / relative_path).read_bytes() == b"file-content"


def test_rejects_missing_or_invalid_file(tmp_path: Path) -> None:
    service = FileStorageService(tmp_path / "storage", max_size_bytes=4)

    with pytest.raises(ResourceFileRequiredError):
        service.save(None, "pdf")
    with pytest.raises(InvalidResourceFileError):
        service.save(make_upload("programa.exe"), "document")
    with pytest.raises(InvalidResourceFileError):
        service.save(make_upload("grande.pdf", b"12345"), "pdf")


def test_link_does_not_create_file(tmp_path: Path) -> None:
    service = FileStorageService(tmp_path / "storage", max_size_bytes=1024)

    assert service.save(None, "link") is None
