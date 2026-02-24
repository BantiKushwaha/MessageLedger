from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r"^$", views.index, name="index"),
    re_path(r"^(?P<asset_path>(css|js)/.+)$", views.asset, name="asset"),
]

