import logging

from django.conf import settings
from django.db import transaction

from compliance.models import ComplianceProject, DocumentDraft, RequirementMapping

logger = logging.getLogger(__name__)

DOC_SECTIONS = [
    (DocumentDraft.DocType.HARA, "Scope and intended use"),
    (DocumentDraft.DocType.HARA, "Hazard identification"),
    (DocumentDraft.DocType.TECHNICAL_FILE, "Product description"),
    (DocumentDraft.DocType.TECHNICAL_FILE, "Applicable standards list"),
    (DocumentDraft.DocType.TECHNICAL_FILE, "Design and manufacturing"),
    (DocumentDraft.DocType.RISK_MANAGEMENT, "Risk management plan"),
    (DocumentDraft.DocType.LABELING, "Labeling and IFU summary"),
]


def _format_requirements(project) -> str:
    lines = []
    for m in (
        project.mappings.filter(status=RequirementMapping.Status.APPLICABLE)
        .select_related("requirement__standard")
    ):
        r = m.requirement
        lines.append(
            f"- **{r.standard.code}** {r.clause_id}: {r.title} — {m.rationale or r.summary}"
        )
    return "\n".join(lines) if lines else "- No applicable requirements mapped yet."


def _template_section(project, doc_type: str, section: str) -> str:
    profile = project.profile
    reqs = _format_requirements(project)
    return f"""# {section}

**Project:** {project.name}
**Category:** {profile.product_category}
**Markets:** {", ".join(profile.target_markets or [])}

## Product summary

{profile.description or profile.intended_use or "See product profile."}

## Applicable requirements (from research agent)

{reqs}

---
*Demo draft — not legal advice. Review with a qualified regulatory professional.*
"""


def _llm_section(project, doc_type: str, section: str) -> str:
    from openai import OpenAI

    profile = project.profile
    reqs = _format_requirements(project)
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Draft a concise markdown section for a hardware technical file. "
                    "Only reference requirements provided. Add disclaimer that this is a draft."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Document type: {doc_type}\nSection: {section}\n"
                    f"Product: {project.name}\nProfile: RF={profile.has_rf}, "
                    f"battery={profile.has_battery}, medical={profile.is_medical}\n"
                    f"Requirements:\n{reqs}"
                ),
            },
        ],
    )
    return response.choices[0].message.content or _template_section(
        project, doc_type, section
    )


class DocumentDraftService:
    @transaction.atomic
    def generate(self, project: ComplianceProject) -> list[DocumentDraft]:
        drafts = []
        for doc_type, section in DOC_SECTIONS:
            if settings.OPENAI_API_KEY and project.mappings.exists():
                try:
                    content = _llm_section(project, doc_type, section)
                except Exception:
                    logger.exception("LLM doc draft failed for %s", section)
                    content = _template_section(project, doc_type, section)
            else:
                content = _template_section(project, doc_type, section)

            draft, created = DocumentDraft.objects.get_or_create(
                project=project,
                doc_type=doc_type,
                section=section,
                defaults={"content_md": content},
            )
            if not created:
                draft.version += 1
                draft.content_md = content
                draft.save()
            drafts.append(draft)

        project.tasks.filter(phase="documentation", sort_order=3).update(
            status="in_progress"
        )
        project.tasks.filter(phase="documentation", sort_order=4).update(
            status="done"
        )
        return drafts
