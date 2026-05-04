from django.urls import path

from planner.views import (
    PlannerDetailView,
    PlannerGenerateView,
    PlannerInputView,
    PlannerRecalculateView,
)

urlpatterns = [
    path("inputs", PlannerInputView.as_view(), name="planner-inputs"),
    path("generate", PlannerGenerateView.as_view(), name="planner-generate"),
    path("plans/<int:plan_id>", PlannerDetailView.as_view(), name="planner-plan-detail"),
    path(
        "plans/<int:plan_id>/recalculate",
        PlannerRecalculateView.as_view(),
        name="planner-plan-recalculate",
    ),
]
