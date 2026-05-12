"""
Deterministic helpers for evidence-matrix YAML rows (see SupplementGuideForPhysicians/EVIDENCE_MATRIX.md).
"""

from __future__ import annotations

from typing import Any, Literal

Direction = Literal["benefit", "harm", "null"]
ConsistencyLabel = Literal["unanimous", "mixed", "contradictory"]
EndpointAlignment = Literal["yes", "no", "partial"]


def infer_consistency_label(
    directions: list[Direction],
    same_endpoint_definition: EndpointAlignment = "yes",
) -> ConsistencyLabel:
    """
    Map per-study directions to a consistency label (rubric in EVIDENCE_MATRIX.md).

    When the endpoint is not fully aligned across studies, treat true benefit-vs-harm
    opposition as *mixed* unless humans document otherwise (avoid fake contradiction).
    """
    if not directions:
        return "mixed"

    normalized = set(directions)
    has_benefit = "benefit" in normalized
    has_harm = "harm" in normalized

    if len(normalized) == 1:
        return "unanimous"

    if has_benefit and has_harm:
        if same_endpoint_definition == "yes":
            return "contradictory"
        return "mixed"

    return "mixed"


def validate_evidence_row(row: dict[str, Any]) -> list[str]:
    """
    Return human-readable validation errors; empty list means OK.
    """
    errors: list[str] = []

    required_top = (
        "row_id",
        "outcome",
        "n_studies",
        "n_participants",
        "per_study",
        "consistency_label",
        "same_endpoint_definition",
    )
    for key in required_top:
        if key not in row or row[key] in (None, ""):
            errors.append(f"missing_or_empty:{key}")

    if errors:
        return errors

    n_studies = row["n_studies"]
    n_participants = row["n_participants"]
    if not isinstance(n_studies, int) or n_studies < 1:
        errors.append("n_studies_must_be_int_ge_1")
    if not isinstance(n_participants, int) or n_participants < 1:
        errors.append("n_participants_must_be_int_ge_1")

    per_study = row["per_study"]
    if not isinstance(per_study, list) or not per_study:
        errors.append("per_study_must_be_non_empty_list")
        return errors

    directions: list[Direction] = []
    allowed = {"benefit", "harm", "null"}
    for i, item in enumerate(per_study):
        if not isinstance(item, dict):
            errors.append(f"per_study_{i}_must_be_object")
            continue
        if "id" not in item or item["id"] in (None, ""):
            errors.append(f"per_study_{i}_missing_id")
        d = item.get("direction")
        if d not in allowed:
            errors.append(f"per_study_{i}_bad_direction:{d!r}")
        else:
            directions.append(d)  # type: ignore[arg-type]

    sed = row["same_endpoint_definition"]
    if sed not in ("yes", "no", "partial"):
        errors.append("same_endpoint_definition_must_be_yes_no_partial")

    label = row["consistency_label"]
    if label not in ("unanimous", "mixed", "contradictory"):
        errors.append("consistency_label_invalid")

    if not errors and directions and sed in ("yes", "no", "partial"):
        expected = infer_consistency_label(directions, sed)  # type: ignore[arg-type]
        if label != expected:
            errors.append(
                f"consistency_label_mismatch:got={label!r},expected={expected!r}"
            )

    return errors
