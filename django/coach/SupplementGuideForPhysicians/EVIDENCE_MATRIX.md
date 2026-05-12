# Supplement ↔ outcome evidence matrix

Physician-facing synthesis rows: one **intervention** can have many rows (each row = one **outcome** in one **population**).

## Columns (minimum)

| Column | What it is |
|--------|----------------|
| `health_domain` / `condition` | Who and what setting (e.g. high-risk men, biopsy-proven PCa). |
| `outcome` | Named endpoint (e.g. total PSA, PCa incidence). |
| `pico_match` | How closely population/intervention/comparator/outcome match your clinical question. |
| `evidence_certainty` | High / moderate / low / very low (GRADE-style), with one-line **why** (bias, inconsistency, imprecision, indirectness). |
| `effect_summary` | Direction + magnitude in plain language; link to stats below. |
| `effect_stat` | Point estimate + 95% CI (or MD/OR/HR as reported). |
| `n_studies` | **Count of studies that contribute evidence to this row** (e.g. trials in the meta-analysis *k*, or `1` for a single trial). |
| `n_participants` | **Total randomised or analysed** across those studies for this outcome (meta-analysis *N*, or single-study *n*). |
| `study_ids` | Stable IDs (PMID, DOI, or internal `SRC-001`) for traceability. |

## Extra columns for **consistency** (needed for AI + humans)

These fields are how you avoid asking the model to “guess” if 2 of 3 studies contradict: you **encode** each study once.

| Column | What it is |
|--------|----------------|
| `same_endpoint_definition` | `yes` / `no` / `partial` — critical; mixed definitions look like “contradiction” but are not. |
| `per_study` | List of objects (see YAML template): one entry per study with `id`, `direction` (`benefit` \| `harm` \| `null`), `effect_stat` if available, `weight_in_meta` optional. |
| `consistency_label` | `unanimous` \| `mixed` \| `contradictory` — set **after** applying the rubric below (human or AI **must** cite `per_study`). |
| `heterogeneity` | If pooled: `i2`, `tau2`, Cochrane `Q` / *p* when reported; if not pooled, `na` + note. |
| `contradiction_notes` | Short explanation when `mixed` or `contradictory` (different dose, duration, population, surrogate vs hard outcome, etc.). |

### Rubric: `contradictory` vs `mixed`

Use **the same outcome definition and timepoint** across studies when comparing directions.

1. **`unanimous`** — all coded `direction` values agree (`benefit` only, or `harm` only, or `null` only), and heterogeneity (if reported) does not suggest incompatible effects once definitions align.
2. **`mixed`** — point estimates differ but **not** in a clearly opposing clinical sense (e.g. all “null” or small benefit with overlapping CIs), or differences are plausibly explained by dose/duration/formulation without opposite clinical calls.
3. **`contradictory`** — **at least two** studies with non-null directions are **opposite** (`benefit` vs `harm`) **for the same endpoint definition**, **or** a majority pattern conflicts with a high-weight study in a way that changes interpretation (document in `contradiction_notes`).

Do **not** label as contradictory based only on “some *p* \< 0.05 and some not” — that is often **imprecision**, not true opposite effects.

## YAML row template (copy for each outcome)

Use this shape in `syntheses/` or in `_evidence_sources/` drafts; ingest pipelines can normalize later.

```yaml
intervention_slug: flavonoids
row_id: flavonoids-psa-highrisk-001
condition: Men at high risk of prostate cancer or with biopsy-proven PCa
outcome: Total PSA (blood)
pico_match: partial  # tighten when you align comparator arms
evidence_certainty: moderate  # example only; justify in certainty_rationale
certainty_rationale: Meta-analysis of RCTs; check RoB2 and imprecision per review.
effect_summary: Lower mean total PSA vs comparator in pooled estimate.
effect_stat: "MD -0.64 (CI: see primary source)"
n_studies: 9
n_participants: 420
study_ids:
  - pmid:40247729  # review paper; replace with included trial PMIDs when curating
same_endpoint_definition: partial
heterogeneity:
  i2: null
  notes: "Fill from forest plot / supplement when available."
per_study:
  - id: TRIAL-A
    direction: benefit
    effect_stat: "MD -0.4 (95% CI …)"
  - id: TRIAL-B
    direction: null
    effect_stat: "MD 0.1 (95% CI includes 0)"
  - id: TRIAL-C
    direction: benefit
    effect_stat: "MD -0.9 (95% CI …)"
consistency_label: unanimous  # or mixed / contradictory — must follow rubric
contradiction_notes: ""
```

## Knowledge-update rule for your AI

When refreshing a row from new papers:

1. **Never** overwrite `n_studies` / `n_participants` without a cited list in `study_ids` / `per_study`.
2. **Recompute** `consistency_label` only from updated `per_study` + `same_endpoint_definition`; if definitions diverge, default to `mixed` and explain.
3. If a new study **flips** `consistency_label` to `contradictory`, require: opposing `direction` with non-overlapping CIs **or** documented incompatible populations/interventions—record in `contradiction_notes`.

This file is the contract: agents should read it before editing synthesis YAML or markdown tables derived from it.
