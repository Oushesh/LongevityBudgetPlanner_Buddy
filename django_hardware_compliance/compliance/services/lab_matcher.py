from django.db import transaction

from compliance.models import ComplianceProject, LabMatch, TestingLab, WorkflowTask


def _score_lab(lab: TestingLab, profile) -> tuple[float, str]:
    markets = set(profile.target_markets or [])
    lab_regions = set(lab.regions or [])
    region_score = len(markets & lab_regions) / max(len(markets), 1)

    categories = {profile.product_category, "consumer_iot", "wellness"}
    if profile.has_rf:
        categories.add("rf")
    if profile.has_battery:
        categories.add("battery")
    if profile.is_medical:
        categories.add("medical")
    lab_cats = set(lab.categories or [])
    cat_score = len(categories & lab_cats) / max(len(categories), 1)

    acc_score = 0.2 if lab.accreditations else 0.0
    score = 0.45 * region_score + 0.45 * cat_score + acc_score
    rationale = (
        f"Region overlap {sorted(markets & lab_regions)}; "
        f"category fit {sorted(categories & lab_cats)}; "
        f"accreditations: {', '.join(lab.accreditations[:3])}."
    )
    return round(min(score, 1.0), 2), rationale


class LabMatcherService:
    @transaction.atomic
    def match(self, project: ComplianceProject, limit: int = 5) -> list[LabMatch]:
        profile = project.profile
        project.lab_matches.all().delete()
        scored = []
        for lab in TestingLab.objects.all():
            score, rationale = _score_lab(lab, profile)
            if score > 0.1:
                scored.append((lab, score, rationale))
        scored.sort(key=lambda x: x[1], reverse=True)
        matches = []
        for lab, score, rationale in scored[:limit]:
            match = LabMatch.objects.create(
                project=project,
                lab=lab,
                score=score,
                rationale=rationale,
            )
            matches.append(match)

        project.tasks.filter(phase="lab", sort_order=5).update(status="in_progress")
        if matches:
            project.status = ComplianceProject.Status.IN_LAB
            project.save(update_fields=["status", "updated_at"])
        return matches
