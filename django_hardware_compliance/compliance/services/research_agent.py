import json
import logging
from datetime import date, timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from compliance.models import (
    AnalysisJob,
    ComplianceProject,
    Requirement,
    RequirementMapping,
    WorkflowTask,
)

logger = logging.getLogger(__name__)

DEFAULT_WORKFLOW_TASKS = [
    (WorkflowTask.Phase.RESEARCH, "Map product to applicable standards", 1),
    (WorkflowTask.Phase.RESEARCH, "Review cited requirements with team", 2),
    (WorkflowTask.Phase.DOCUMENTATION, "Draft hazard analysis (HARA)", 3),
    (WorkflowTask.Phase.DOCUMENTATION, "Assemble technical file for lab", 4),
    (WorkflowTask.Phase.LAB, "Select accredited testing partner", 5),
    (WorkflowTask.Phase.LAB, "Submit samples and test plan", 6),
    (WorkflowTask.Phase.CLEARANCE, "Obtain certificates and declarations", 7),
    (WorkflowTask.Phase.CLEARANCE, "Buyer / procurement sign-off", 8),
]


def _product_tags(profile) -> set[str]:
    tags = {profile.product_category, "consumer_iot", "wellness"}
    if profile.has_rf:
        tags.update({"wifi", "rf", "wireless"})
    if profile.has_battery:
        tags.update({"battery", "lithium"})
    if profile.is_medical:
        tags.update({"medical", f"medical_class_{profile.medical_class or 'I'}"})
    return tags


def _candidate_requirements(profile):
    tags = _product_tags(profile)
    markets = set(profile.target_markets or [])
    qs = Requirement.objects.select_related("standard").all()
    candidates = []
    for req in qs:
        req_tags = set(req.product_tags or [])
        req_markets = set(req.markets or [])
        if tags & req_tags or (markets & req_markets):
            candidates.append(req)
    return candidates


def _rule_based_mapping(project, profile, candidates):
    """Deterministic fallback when OpenAI is unavailable."""
    mappings = []
    for req in candidates:
        tags = _product_tags(profile)
        req_tags = set(req.product_tags or [])
        overlap = tags & req_tags
        markets = set(profile.target_markets or [])
        market_overlap = markets & set(req.markets or [])
        if not overlap and not market_overlap:
            continue
        confidence = min(0.95, 0.5 + 0.1 * len(overlap) + 0.15 * bool(market_overlap))
        status = RequirementMapping.Status.APPLICABLE
        if profile.is_medical and "medical" not in req_tags and req.standard.category == "medical":
            status = RequirementMapping.Status.NEEDS_REVIEW
        mappings.append(
            {
                "requirement_id": req.id,
                "status": status,
                "citation": req.standard.official_url or f"{req.standard.code} {req.clause_id}",
                "rationale": (
                    f"Matched via product tags {sorted(overlap)} and markets "
                    f"{sorted(market_overlap)} for {profile.product_category}."
                ),
                "confidence": confidence,
            }
        )
    return mappings


def _llm_mapping(project, profile, candidates):
    from openai import OpenAI
    from pydantic import BaseModel

    class MappingItem(BaseModel):
        requirement_id: int
        status: str
        citation: str
        rationale: str
        confidence: float

    class MappingResult(BaseModel):
        mappings: list[MappingItem]

    req_payload = [
        {
            "id": r.id,
            "standard": r.standard.code,
            "clause_id": r.clause_id,
            "title": r.title,
            "summary": r.summary,
            "tags": r.product_tags,
            "markets": r.markets,
        }
        for r in candidates[:40]
    ]
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    product_payload = {
        "name": project.name,
        "profile": {
            "description": profile.description,
            "category": profile.product_category,
            "markets": profile.target_markets,
            "has_rf": profile.has_rf,
            "has_battery": profile.has_battery,
            "is_medical": profile.is_medical,
            "medical_class": profile.medical_class,
            "intended_use": profile.intended_use,
        },
    }
    prompt = (
        "You are a hardware compliance research agent. Given the product profile and "
        "candidate requirements from our database, return ONLY mappings for requirements "
        "that apply. Use status: applicable, not_applicable, or needs_review. "
        "Citations must reference the standard code and clause_id — do not invent new clauses.\n\n"
        f"Product: {json.dumps(product_payload)}\n\n"
        f"Candidates: {json.dumps(req_payload)}"
    )
    response = client.beta.chat.completions.parse(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Return structured compliance mappings only."},
            {"role": "user", "content": prompt},
        ],
        response_format=MappingResult,
    )
    parsed = response.choices[0].message.parsed
    return [m.model_dump() for m in parsed.mappings]


class ResearchAgentService:
    @transaction.atomic
    def run(self, project: ComplianceProject) -> AnalysisJob:
        profile = project.profile
        job = AnalysisJob.objects.create(
            project=project,
            job_type=AnalysisJob.JobType.RESEARCH,
            status=AnalysisJob.Status.RUNNING,
            started_at=timezone.now(),
        )
        project.status = ComplianceProject.Status.ANALYZING
        project.save(update_fields=["status", "updated_at"])

        try:
            candidates = _candidate_requirements(profile)
            if settings.OPENAI_API_KEY:
                try:
                    raw_mappings = _llm_mapping(project, profile, candidates)
                except Exception:
                    logger.exception("LLM mapping failed; using rule-based fallback")
                    raw_mappings = _rule_based_mapping(project, profile, candidates)
            else:
                raw_mappings = _rule_based_mapping(project, profile, candidates)

            project.mappings.all().delete()
            valid_ids = {r.id for r in candidates}
            for item in raw_mappings:
                rid = item["requirement_id"]
                if rid not in valid_ids:
                    continue
                RequirementMapping.objects.create(
                    project=project,
                    requirement_id=rid,
                    status=item.get("status", RequirementMapping.Status.NEEDS_REVIEW),
                    citation=item.get("citation", "")[:500],
                    rationale=item.get("rationale", ""),
                    confidence=float(item.get("confidence", 0.5)),
                )

            if not project.tasks.exists():
                due = date.today()
                for phase, title, order in DEFAULT_WORKFLOW_TASKS:
                    WorkflowTask.objects.create(
                        project=project,
                        phase=phase,
                        title=title,
                        sort_order=order,
                        due_at=due + timedelta(days=7 * order),
                        status=WorkflowTask.Status.PENDING
                        if order > 1
                        else WorkflowTask.Status.IN_PROGRESS,
                    )

            project.tasks.filter(sort_order=1).update(status=WorkflowTask.Status.DONE)
            project.tasks.filter(sort_order=2).update(
                status=WorkflowTask.Status.IN_PROGRESS
            )

            project.status = ComplianceProject.Status.READY
            project.save(update_fields=["status", "updated_at"])

            job.status = AnalysisJob.Status.COMPLETED
            job.completed_at = timezone.now()
            job.save()
        except Exception as exc:
            job.status = AnalysisJob.Status.FAILED
            job.error = str(exc)
            job.completed_at = timezone.now()
            job.save()
            project.status = ComplianceProject.Status.DRAFT
            project.save(update_fields=["status", "updated_at"])
            raise

        return job
