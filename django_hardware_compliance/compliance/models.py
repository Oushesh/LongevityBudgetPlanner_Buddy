from django.conf import settings
from django.db import models


class Standard(models.Model):
    class Category(models.TextChoices):
        RF = "rf", "RF / Wireless"
        SAFETY = "safety", "Safety"
        MEDICAL = "medical", "Medical"
        QUALITY = "quality", "Quality"
        EMC = "emc", "EMC"
        BATTERY = "battery", "Battery / Transport"

    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    region = models.CharField(max_length=64)
    category = models.CharField(max_length=32, choices=Category.choices)
    unlocks = models.TextField(help_text="Marketing one-liner for what this unlocks")
    official_url = models.URLField(max_length=500, blank=True)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.code


class Requirement(models.Model):
    class Severity(models.TextChoices):
        CRITICAL = "critical", "Critical"
        HIGH = "high", "High"
        MEDIUM = "medium", "Medium"
        LOW = "low", "Low"

    standard = models.ForeignKey(
        Standard, on_delete=models.CASCADE, related_name="requirements"
    )
    clause_id = models.CharField(max_length=64)
    title = models.CharField(max_length=255)
    summary = models.TextField()
    severity = models.CharField(
        max_length=16, choices=Severity.choices, default=Severity.MEDIUM
    )
    product_tags = models.JSONField(
        default=list,
        help_text="e.g. wifi, battery, wellness, medical_class_I",
    )
    markets = models.JSONField(
        default=list,
        help_text="e.g. US, EU, DE",
    )

    class Meta:
        ordering = ["standard__code", "clause_id"]
        unique_together = [("standard", "clause_id")]

    def __str__(self):
        return f"{self.standard.code} {self.clause_id}"


class TestingLab(models.Model):
    name = models.CharField(max_length=255)
    regions = models.JSONField(default=list)
    accreditations = models.JSONField(default=list)
    categories = models.JSONField(default=list)
    contact_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ComplianceProject(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        ANALYZING = "analyzing", "Analyzing"
        READY = "ready", "Ready"
        IN_LAB = "in_lab", "In lab"
        CLEARED = "cleared", "Cleared"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="compliance_projects",
    )
    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.DRAFT
    )
    is_demo = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name


class ProductProfile(models.Model):
    project = models.OneToOneField(
        ComplianceProject, on_delete=models.CASCADE, related_name="profile"
    )
    description = models.TextField(blank=True)
    product_category = models.CharField(max_length=128, default="consumer_iot")
    target_markets = models.JSONField(default=list)
    has_rf = models.BooleanField(default=False)
    has_battery = models.BooleanField(default=False)
    is_medical = models.BooleanField(default=False)
    medical_class = models.CharField(max_length=32, blank=True)
    intended_use = models.TextField(blank=True)

    def __str__(self):
        return f"Profile for {self.project.name}"


class RequirementMapping(models.Model):
    class Status(models.TextChoices):
        APPLICABLE = "applicable", "Applicable"
        NOT_APPLICABLE = "not_applicable", "Not applicable"
        NEEDS_REVIEW = "needs_review", "Needs review"

    project = models.ForeignKey(
        ComplianceProject, on_delete=models.CASCADE, related_name="mappings"
    )
    requirement = models.ForeignKey(
        Requirement, on_delete=models.CASCADE, related_name="mappings"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEEDS_REVIEW
    )
    citation = models.CharField(max_length=500, blank=True)
    rationale = models.TextField(blank=True)
    confidence = models.FloatField(default=0.0)
    reviewed = models.BooleanField(default=False)

    class Meta:
        unique_together = [("project", "requirement")]

    def __str__(self):
        return f"{self.project.name} — {self.requirement}"


class DocumentDraft(models.Model):
    class DocType(models.TextChoices):
        HARA = "HARA", "Hazard Analysis"
        TECHNICAL_FILE = "technical_file", "Technical file"
        RISK_MANAGEMENT = "risk_management", "Risk management"
        LABELING = "labeling", "Labeling"

    project = models.ForeignKey(
        ComplianceProject, on_delete=models.CASCADE, related_name="documents"
    )
    doc_type = models.CharField(max_length=32, choices=DocType.choices)
    section = models.CharField(max_length=128)
    content_md = models.TextField(blank=True)
    version = models.PositiveIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("project", "doc_type", "section")]
        ordering = ["doc_type", "section"]

    def __str__(self):
        return f"{self.project.name} — {self.doc_type}/{self.section}"


class LabMatch(models.Model):
    class Status(models.TextChoices):
        SUGGESTED = "suggested", "Suggested"
        CONTACTED = "contacted", "Contacted"
        ENGAGED = "engaged", "Engaged"

    project = models.ForeignKey(
        ComplianceProject, on_delete=models.CASCADE, related_name="lab_matches"
    )
    lab = models.ForeignKey(
        TestingLab, on_delete=models.CASCADE, related_name="matches"
    )
    score = models.FloatField(default=0.0)
    rationale = models.TextField(blank=True)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.SUGGESTED
    )

    class Meta:
        unique_together = [("project", "lab")]
        ordering = ["-score"]

    def __str__(self):
        return f"{self.project.name} — {self.lab.name}"


class WorkflowTask(models.Model):
    class Phase(models.TextChoices):
        RESEARCH = "research", "Research"
        DOCUMENTATION = "documentation", "Documentation"
        LAB = "lab", "Lab"
        CLEARANCE = "clearance", "Clearance"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In progress"
        DONE = "done", "Done"
        BLOCKED = "blocked", "Blocked"

    project = models.ForeignKey(
        ComplianceProject, on_delete=models.CASCADE, related_name="tasks"
    )
    phase = models.CharField(max_length=20, choices=Phase.choices)
    title = models.CharField(max_length=255)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.PENDING
    )
    sort_order = models.PositiveSmallIntegerField(default=0)
    due_at = models.DateField(null=True, blank=True)
    blocker_note = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.title


class AnalysisJob(models.Model):
    class JobType(models.TextChoices):
        RESEARCH = "research", "Research"
        DOCUMENTATION = "documentation", "Documentation"

    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    project = models.ForeignKey(
        ComplianceProject, on_delete=models.CASCADE, related_name="jobs"
    )
    job_type = models.CharField(max_length=20, choices=JobType.choices)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.QUEUED
    )
    error = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
