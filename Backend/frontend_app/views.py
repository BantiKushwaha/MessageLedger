from __future__ import annotations

import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


def index(_request):
    index_path = Path(settings.FRONTEND_DIR) / "index.html"
    if not index_path.exists():
        raise Http404("Frontend index.html not found")
    return FileResponse(index_path.open("rb"), content_type="text/html; charset=utf-8")


def asset(_request, asset_path: str):
    # Only allow serving from known frontend dirs
    safe_root = Path(settings.FRONTEND_DIR).resolve()
    full_path = (safe_root / asset_path).resolve()
    if safe_root not in full_path.parents:
        raise Http404("Not found")
    if not full_path.exists() or not full_path.is_file():
        raise Http404("Not found")

    content_type, _ = mimetypes.guess_type(str(full_path))
    return FileResponse(full_path.open("rb"), content_type=content_type or "application/octet-stream")
