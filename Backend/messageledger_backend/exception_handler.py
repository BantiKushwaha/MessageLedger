from __future__ import annotations

from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def _flatten_validation(detail: Any) -> str:
    if isinstance(detail, list):
        parts = [str(x) for x in detail if str(x)]
        return "; ".join(parts)
    if isinstance(detail, dict):
        pairs: list[str] = []
        for field, msgs in detail.items():
            msg = _flatten_validation(msgs)
            if msg:
                pairs.append(f"{field}: {msg}")
        return "; ".join(pairs)
    return str(detail) if detail is not None else ""


def api_exception_handler(exc: Exception, context: dict) -> Response | None:
    """
    Match Spring's `{ "message": "field: error; ..." }` shape so the existing
    frontend can display errors without changes.
    """
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    if response.status_code in (status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND):
        message = _flatten_validation(getattr(response, "data", None))
        if not message:
            message = "Request failed."
        response.data = {"message": message}
        return response

    if hasattr(response, "data") and isinstance(response.data, dict):
        if "detail" in response.data:
            response.data = {"message": str(response.data["detail"])}
        elif "message" not in response.data:
            response.data = {"message": "Request failed."}
    return response

