from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from compliance.models import (
    ComplianceProject,
    DocumentDraft,
    LabMatch,
    RequirementMapping,
    Standard,
    WorkflowTask,
)
from compliance.serializers import (
    ComplianceProjectCreateSerializer,
    ComplianceProjectDetailSerializer,
    ComplianceProjectListSerializer,
    ComplianceProjectPatchSerializer,
    DocumentDraftSerializer,
    LabMatchSerializer,
    RequirementMappingSerializer,
    RequirementMappingUpdateSerializer,
    StandardSerializer,
    WorkflowTaskSerializer,
    WorkflowTaskUpdateSerializer,
)
from compliance.services import (
    DocumentDraftService,
    LabMatcherService,
    ResearchAgentService,
)


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "hardware-compliance"})


class StandardListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = Standard.objects.all()
        return Response(StandardSerializer(qs, many=True).data)


class ProjectListCreateView(APIView):
    def get(self, request):
        qs = ComplianceProject.objects.filter(user=request.user).select_related(
            "profile"
        )
        return Response(ComplianceProjectListSerializer(qs, many=True).data)

    def post(self, request):
        serializer = ComplianceProjectCreateSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        return Response(
            ComplianceProjectDetailSerializer(project).data,
            status=status.HTTP_201_CREATED,
        )


class ProjectDetailView(APIView):
    def get_project(self, request, project_id):
        return get_object_or_404(
            ComplianceProject.objects.select_related("profile"),
            pk=project_id,
            user=request.user,
        )

    def get(self, request, project_id):
        project = self.get_project(request, project_id)
        return Response(ComplianceProjectDetailSerializer(project).data)

    def patch(self, request, project_id):
        project = self.get_project(request, project_id)
        serializer = ComplianceProjectPatchSerializer(
            project, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ComplianceProjectDetailSerializer(project).data)


class ProjectAnalyzeView(APIView):
    def post(self, request, project_id):
        project = get_object_or_404(
            ComplianceProject.objects.select_related("profile"),
            pk=project_id,
            user=request.user,
        )
        job = ResearchAgentService().run(project)
        return Response(
            {
                "job_id": job.id,
                "status": job.status,
                "project": ComplianceProjectDetailSerializer(project).data,
                "mappings": RequirementMappingSerializer(
                    project.mappings.select_related(
                        "requirement__standard"
                    ),
                    many=True,
                ).data,
                "tasks": WorkflowTaskSerializer(project.tasks.all(), many=True).data,
            }
        )


class ProjectRequirementsView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(ComplianceProject, pk=project_id, user=request.user)
        qs = project.mappings.select_related("requirement__standard")
        return Response(RequirementMappingSerializer(qs, many=True).data)


class ProjectRequirementPatchView(APIView):
    def patch(self, request, project_id, mapping_id):
        mapping = get_object_or_404(
            RequirementMapping.objects.select_related("requirement__standard"),
            pk=mapping_id,
            project_id=project_id,
            project__user=request.user,
        )
        serializer = RequirementMappingUpdateSerializer(
            mapping, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(RequirementMappingSerializer(mapping).data)


class ProjectDraftDocsView(APIView):
    def post(self, request, project_id):
        project = get_object_or_404(
            ComplianceProject.objects.select_related("profile"),
            pk=project_id,
            user=request.user,
        )
        drafts = DocumentDraftService().generate(project)
        return Response(DocumentDraftSerializer(drafts, many=True).data)


class ProjectDocumentsView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(ComplianceProject, pk=project_id, user=request.user)
        qs = project.documents.all()
        return Response(DocumentDraftSerializer(qs, many=True).data)


class ProjectMatchLabsView(APIView):
    def post(self, request, project_id):
        project = get_object_or_404(
            ComplianceProject.objects.select_related("profile"),
            pk=project_id,
            user=request.user,
        )
        matches = LabMatcherService().match(project)
        return Response(LabMatchSerializer(matches, many=True).data)


class ProjectLabsView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(ComplianceProject, pk=project_id, user=request.user)
        qs = project.lab_matches.select_related("lab")
        return Response(LabMatchSerializer(qs, many=True).data)


class ProjectTasksView(APIView):
    def get(self, request, project_id):
        project = get_object_or_404(ComplianceProject, pk=project_id, user=request.user)
        return Response(WorkflowTaskSerializer(project.tasks.all(), many=True).data)


class ProjectTaskPatchView(APIView):
    def patch(self, request, project_id, task_id):
        task = get_object_or_404(
            WorkflowTask,
            pk=task_id,
            project_id=project_id,
            project__user=request.user,
        )
        serializer = WorkflowTaskUpdateSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(WorkflowTaskSerializer(task).data)
