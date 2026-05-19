from django.db import transaction
from rest_framework import serializers

from compliance.models import (
    ComplianceProject,
    DocumentDraft,
    LabMatch,
    ProductProfile,
    Requirement,
    RequirementMapping,
    Standard,
    TestingLab,
    WorkflowTask,
)


class StandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Standard
        fields = (
            "id",
            "code",
            "name",
            "region",
            "category",
            "unlocks",
            "official_url",
        )


class RequirementSerializer(serializers.ModelSerializer):
    standard_code = serializers.CharField(source="standard.code", read_only=True)
    standard_name = serializers.CharField(source="standard.name", read_only=True)
    official_url = serializers.URLField(source="standard.official_url", read_only=True)

    class Meta:
        model = Requirement
        fields = (
            "id",
            "standard_code",
            "standard_name",
            "official_url",
            "clause_id",
            "title",
            "summary",
            "severity",
            "product_tags",
            "markets",
        )


class ProductProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductProfile
        fields = (
            "description",
            "product_category",
            "target_markets",
            "has_rf",
            "has_battery",
            "is_medical",
            "medical_class",
            "intended_use",
        )


class RequirementMappingSerializer(serializers.ModelSerializer):
    requirement = RequirementSerializer(read_only=True)

    class Meta:
        model = RequirementMapping
        fields = (
            "id",
            "requirement",
            "status",
            "citation",
            "rationale",
            "confidence",
            "reviewed",
        )


class RequirementMappingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequirementMapping
        fields = ("status", "reviewed", "rationale")


class DocumentDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentDraft
        fields = (
            "id",
            "doc_type",
            "section",
            "content_md",
            "version",
            "updated_at",
        )


class TestingLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestingLab
        fields = (
            "id",
            "name",
            "regions",
            "accreditations",
            "categories",
            "contact_url",
            "description",
        )


class LabMatchSerializer(serializers.ModelSerializer):
    lab = TestingLabSerializer(read_only=True)

    class Meta:
        model = LabMatch
        fields = ("id", "lab", "score", "rationale", "status")


class WorkflowTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowTask
        fields = (
            "id",
            "phase",
            "title",
            "status",
            "sort_order",
            "due_at",
            "blocker_note",
        )


class WorkflowTaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowTask
        fields = ("status", "blocker_note")


class ComplianceProjectListSerializer(serializers.ModelSerializer):
    product_category = serializers.CharField(
        source="profile.product_category", read_only=True, default=""
    )
    target_markets = serializers.JSONField(
        source="profile.target_markets", read_only=True, default=list
    )

    class Meta:
        model = ComplianceProject
        fields = (
            "id",
            "name",
            "status",
            "is_demo",
            "product_category",
            "target_markets",
            "created_at",
            "updated_at",
        )


class ComplianceProjectDetailSerializer(serializers.ModelSerializer):
    profile = ProductProfileSerializer(read_only=True)
    mappings_count = serializers.SerializerMethodField()
    documents_count = serializers.SerializerMethodField()
    lab_matches_count = serializers.SerializerMethodField()

    class Meta:
        model = ComplianceProject
        fields = (
            "id",
            "name",
            "status",
            "is_demo",
            "profile",
            "mappings_count",
            "documents_count",
            "lab_matches_count",
            "created_at",
            "updated_at",
        )

    def get_mappings_count(self, obj):
        return obj.mappings.count()

    def get_documents_count(self, obj):
        return obj.documents.count()

    def get_lab_matches_count(self, obj):
        return obj.lab_matches.count()


class ComplianceProjectCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    profile = ProductProfileSerializer()

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        profile_data = validated_data.pop("profile")
        project = ComplianceProject.objects.create(
            user=user,
            name=validated_data["name"],
            status=ComplianceProject.Status.DRAFT,
        )
        ProductProfile.objects.create(project=project, **profile_data)
        return project


class ComplianceProjectPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceProject
        fields = ("name", "status")
