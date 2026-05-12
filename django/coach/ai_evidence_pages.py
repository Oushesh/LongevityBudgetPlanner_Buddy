"""
LLM helpers: extract structured outcome claims from prose / markdown pages, then
run deterministic comparison (``evidence_page_compare``).

Requires ``OPENAI_API_KEY`` in the environment when calling ``extract_claims_from_page``.
"""

from __future__ import annotations

import json
from typing import Any

EXTRACTION_SYSTEM = """You extract structured evidence claims from a single document (markdown or plain text).

Return **only** valid JSON: an object with key "claims" whose value is an array.
Each array element must have:
- "intervention": short name (e.g. flavonoids, zinc)
- "condition": population / setting in one phrase
- "outcome": measured endpoint (biomarker or clinical)
- "aggregate_direction": one of benefit | harm | null | unknown (overall author conclusion for that outcome)
- "n_studies": integer or null if not stated
- "n_participants": integer or null if not stated
- "consistency_label": one of unanimous | mixed | contradictory | unknown (only if the text states it; else unknown)

Rules:
- One object per distinct outcome discussed; do not duplicate the same PICO.
- If the text gives conflicting trial directions, set aggregate_direction to the pooled/meta conclusion if any; else null and consistency_label mixed or contradictory as appropriate.
- If unsure, use unknown for aggregate_direction.
"""


def build_extraction_user_message(page_text: str, page_label: str) -> str:
    return (
        f"Document label: {page_label}\n\n"
        "Extract claims as specified. Document follows.\n\n---\n"
        f"{page_text}\n---"
    )


def extract_claims_from_page(
    page_text: str,
    *,
    page_label: str = "page",
    model: str = "gpt-4o-mini",
) -> list[dict[str, Any]]:
    """
    Call OpenAI Chat Completions with JSON mode. Raises if the API key is missing
    or the response is not parseable.

    For unit tests, patch ``openai.OpenAI`` or pass a thin wrapper in a future refactor.
    """
    from openai import OpenAI

    client = OpenAI()
    resp = client.chat.completions.create(
        model=model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": EXTRACTION_SYSTEM},
            {
                "role": "user",
                "content": build_extraction_user_message(page_text, page_label),
            },
        ],
    )
    raw = resp.choices[0].message.content or "{}"
    data = json.loads(raw)
    claims = data.get("claims")
    if not isinstance(claims, list):
        return []
    return [c for c in claims if isinstance(c, dict)]


def compare_pages_via_llm_pipeline(
    text_a: str,
    text_b: str,
    *,
    label_a: str = "A",
    label_b: str = "B",
    model: str = "gpt-4o-mini",
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], str]:
    """
    Full pipeline: extract claims from each page, then deterministic ``best_pair_verdict``.

    Returns ``(claims_a, claims_b, verdict)`` where verdict is
    incomparable | agree | mixed | contradict.
    """
    from coach.evidence_page_compare import best_pair_verdict

    ca = extract_claims_from_page(text_a, page_label=label_a, model=model)
    cb = extract_claims_from_page(text_b, page_label=label_b, model=model)
    return ca, cb, best_pair_verdict(ca, cb)
