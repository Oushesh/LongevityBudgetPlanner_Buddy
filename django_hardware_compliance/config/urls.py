from django.contrib import admin
from django.urls import include, path

from compliance.views import HealthView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health", HealthView.as_view(), name="health"),
    path("auth/", include("users.urls")),
    path("compliance/", include("compliance.urls")),
]
