from django.contrib import admin

from compliance.models import (
    AnalysisJob,
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

admin.site.register(Standard)
admin.site.register(Requirement)
admin.site.register(TestingLab)
admin.site.register(ComplianceProject)
admin.site.register(ProductProfile)
admin.site.register(RequirementMapping)
admin.site.register(DocumentDraft)
admin.site.register(LabMatch)
admin.site.register(WorkflowTask)
admin.site.register(AnalysisJob)
