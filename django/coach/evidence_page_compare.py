"""
Compare two evidence *pages* (or two aggregate rows) for agreement vs contradiction.

Pipeline:
1. (Optional AI) Turn each page into a list of structured ``OutcomeClaim`` dicts — same
   schema as matrix rows, one entry per outcome block.
2. **Align** claims that refer to the same PICO (intervention + condition + outcome).
3. **Decide** using ``compare_aligned_claims`` (pure logic, testable, no LLM).

LLMs are better at *extraction* and *alignment explanations* than at being the sole
source of truth for "contradictory or not".
"""

from __future__ import annotations

import re
import unicodedata
from typing import Any, Literal

Direction = Literal["benefit", "harm", "null", "unknown"]
CrossPageVerdict = Literal["incomparable", "agree", "mixed", "contradict"]


def _norm(s: str) -> str:
    s = unicodedata.normalize("NFKC", s or "")
    s = s.lower().strip()
    s = re.sub(r"\s+", " ", s)
    return s


def pico_compatible(
    intervention_a: str,
    intervention_b: str,
    condition_a: str,
    condition_b: str,
    outcome_a: str,
    outcome_b: str,
) -> bool:
    """Conservative MVP: exact normalized match on all three axes."""
    return (
        _norm(intervention_a) == _norm(intervention_b)
        and _norm(condition_a) == _norm(condition_b)
        and _norm(outcome_a) == _norm(outcome_b)
    )


def compare_direction_pair(
    da: Direction,
    db: Direction,
) -> CrossPageVerdict:
    """
    Compare two *aggregate* directions for the **same** outcome and population.

    ``unknown`` with anything → ``mixed`` (insufficient to call agreement or clash).
    """
    if da == "unknown" or db == "unknown":
        return "mixed"
    if da == db:
        return "agree"
    pair = {da, db}
    if pair == {"benefit", "harm"}:
        return "contradict"
    if "null" in pair:
        return "mixed"
    return "mixed"


def compare_aligned_claims(claim_a: dict[str, Any], claim_b: dict[str, Any]) -> CrossPageVerdict:
    """
    ``claim_*`` must include string keys:
    ``intervention``, ``condition``, ``outcome``, ``aggregate_direction`` in
    ``benefit|harm|null|unknown``.

    Uses ``consistency_label`` only as a tie-breaker hint when both directions are
    ``null`` (both pages report no clear effect → ``agree``).
    """
    for key in ("intervention", "condition", "outcome", "aggregate_direction"):
        if key not in claim_a or key not in claim_b:
            return "incomparable"

    if not pico_compatible(
        claim_a["intervention"],
        claim_b["intervention"],
        claim_a["condition"],
        claim_b["condition"],
        claim_a["outcome"],
        claim_b["outcome"],
    ):
        return "incomparable"

    da = claim_a["aggregate_direction"]
    db = claim_b["aggregate_direction"]
    if da not in ("benefit", "harm", "null", "unknown") or db not in (
        "benefit",
        "harm",
        "null",
        "unknown",
    ):
        return "incomparable"

    verdict = compare_direction_pair(da, db)  # type: ignore[arg-type]
    return verdict


def best_pair_verdict(claims_a: list[dict[str, Any]], claims_b: list[dict[str, Any]]) -> CrossPageVerdict:
    """
    For two pages, each represented as a list of outcome claims, find the **strongest**
    signal across all PICO-aligned pairs: ``contradict`` > ``mixed`` > ``agree`` >
    ``incomparable``.
    """
    rank = {"incomparable": 0, "agree": 1, "mixed": 2, "contradict": 3}
    best: CrossPageVerdict = "incomparable"
    for ca in claims_a:
        for cb in claims_b:
            v = compare_aligned_claims(ca, cb)
            if rank[v] > rank[best]:
                best = v
    return best
