from django.urls import path

from compliance.views import (
    ProjectAnalyzeView,
    ProjectDetailView,
    ProjectDocumentsView,
    ProjectDraftDocsView,
    ProjectLabsView,
    ProjectListCreateView,
    ProjectMatchLabsView,
    ProjectRequirementPatchView,
    ProjectRequirementsView,
    ProjectTaskPatchView,
    ProjectTasksView,
    StandardListView,
)

urlpatterns = [
    path("standards", StandardListView.as_view(), name="compliance-standards"),
    path("projects", ProjectListCreateView.as_view(), name="compliance-projects"),
    path(
        "projects/<int:project_id>",
        ProjectDetailView.as_view(),
        name="compliance-project-detail",
    ),
    path(
        "projects/<int:project_id>/analyze",
        ProjectAnalyzeView.as_view(),
        name="compliance-project-analyze",
    ),
    path(
        "projects/<int:project_id>/requirements",
        ProjectRequirementsView.as_view(),
        name="compliance-project-requirements",
    ),
    path(
        "projects/<int:project_id>/requirements/<int:mapping_id>",
        ProjectRequirementPatchView.as_view(),
        name="compliance-project-requirement-patch",
    ),
    path(
        "projects/<int:project_id>/draft-docs",
        ProjectDraftDocsView.as_view(),
        name="compliance-project-draft-docs",
    ),
    path(
        "projects/<int:project_id>/documents",
        ProjectDocumentsView.as_view(),
        name="compliance-project-documents",
    ),
    path(
        "projects/<int:project_id>/match-labs",
        ProjectMatchLabsView.as_view(),
        name="compliance-project-match-labs",
    ),
    path(
        "projects/<int:project_id>/labs",
        ProjectLabsView.as_view(),
        name="compliance-project-labs",
    ),
    path(
        "projects/<int:project_id>/tasks",
        ProjectTasksView.as_view(),
        name="compliance-project-tasks",
    ),
    path(
        "projects/<int:project_id>/tasks/<int:task_id>",
        ProjectTaskPatchView.as_view(),
        name="compliance-project-task-patch",
    ),
]
