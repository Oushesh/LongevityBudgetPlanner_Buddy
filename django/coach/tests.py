from django.test import SimpleTestCase

from coach.evidence_page_compare import (
    best_pair_verdict,
    compare_aligned_claims,
    compare_direction_pair,
    pico_compatible,
)
from coach.evidence_synthesis import infer_consistency_label, validate_evidence_row


class InferConsistencyLabelTests(SimpleTestCase):
    def test_unanimous_benefit(self):
        self.assertEqual(
            infer_consistency_label(["benefit", "benefit"], "yes"),
            "unanimous",
        )

    def test_contradictory_when_endpoint_aligned(self):
        self.assertEqual(
            infer_consistency_label(["benefit", "harm", "benefit"], "yes"),
            "contradictory",
        )

    def test_mixed_when_endpoint_partial_but_benefit_and_harm(self):
        self.assertEqual(
            infer_consistency_label(["benefit", "harm"], "partial"),
            "mixed",
        )

    def test_mixed_benefit_and_null(self):
        self.assertEqual(
            infer_consistency_label(["benefit", "null", "null"], "yes"),
            "mixed",
        )


class ValidateEvidenceRowTests(SimpleTestCase):
    def _minimal_row(self, **overrides):
        base = {
            "row_id": "test-001",
            "outcome": "Total PSA",
            "n_studies": 2,
            "n_participants": 200,
            "same_endpoint_definition": "yes",
            "per_study": [
                {"id": "A", "direction": "benefit"},
                {"id": "B", "direction": "benefit"},
            ],
            "consistency_label": "unanimous",
        }
        base.update(overrides)
        return base

    def test_valid_row(self):
        self.assertEqual(validate_evidence_row(self._minimal_row()), [])

    def test_missing_field(self):
        row = self._minimal_row()
        del row["row_id"]
        self.assertTrue(any("missing_or_empty" in e for e in validate_evidence_row(row)))

    def test_label_mismatch(self):
        row = self._minimal_row(
            per_study=[
                {"id": "A", "direction": "benefit"},
                {"id": "B", "direction": "harm"},
            ],
            consistency_label="unanimous",
        )
        errs = validate_evidence_row(row)
        self.assertTrue(any("consistency_label_mismatch" in e for e in errs))

    def test_partial_endpoint_benefit_and_harm_is_mixed_not_contradictory(self):
        row = self._minimal_row(
            same_endpoint_definition="partial",
            per_study=[
                {"id": "A", "direction": "benefit"},
                {"id": "B", "direction": "harm"},
            ],
            consistency_label="mixed",
        )
        self.assertEqual(validate_evidence_row(row), [])

        row_bad = self._minimal_row(
            same_endpoint_definition="partial",
            per_study=[
                {"id": "A", "direction": "benefit"},
                {"id": "B", "direction": "harm"},
            ],
            consistency_label="contradictory",
            contradiction_notes="explained in review",
        )
        self.assertTrue(
            any("consistency_label_mismatch" in e for e in validate_evidence_row(row_bad))
        )


class CompareDirectionPairTests(SimpleTestCase):
    def test_agree(self):
        self.assertEqual(compare_direction_pair("benefit", "benefit"), "agree")

    def test_contradict(self):
        self.assertEqual(compare_direction_pair("benefit", "harm"), "contradict")

    def test_mixed_null_benefit(self):
        self.assertEqual(compare_direction_pair("null", "benefit"), "mixed")

    def test_unknown(self):
        self.assertEqual(compare_direction_pair("unknown", "benefit"), "mixed")


class CompareAlignedClaimsTests(SimpleTestCase):
    def _claim(self, **kw):
        base = {
            "intervention": "flavonoids",
            "condition": "men at high risk of prostate cancer",
            "outcome": "total psa",
            "aggregate_direction": "benefit",
        }
        base.update(kw)
        return base

    def test_incomparable_different_outcome(self):
        a = self._claim(outcome="total psa")
        b = self._claim(outcome="pca incidence")
        self.assertEqual(compare_aligned_claims(a, b), "incomparable")

    def test_contradict_same_pico(self):
        a = self._claim(aggregate_direction="benefit")
        b = self._claim(aggregate_direction="harm")
        self.assertEqual(compare_aligned_claims(a, b), "contradict")

    def test_agree_both_null(self):
        a = self._claim(aggregate_direction="null")
        b = self._claim(aggregate_direction="null")
        self.assertEqual(compare_aligned_claims(a, b), "agree")


class BestPairVerdictTests(SimpleTestCase):
    def test_finds_contradict_among_pairs(self):
        claims_a = [
            {
                "intervention": "zinc",
                "condition": "healthy adults",
                "outcome": "serum testosterone",
                "aggregate_direction": "benefit",
            }
        ]
        claims_b = [
            {
                "intervention": "zinc",
                "condition": "healthy adults",
                "outcome": "serum testosterone",
                "aggregate_direction": "harm",
            },
            {
                "intervention": "zinc",
                "condition": "other cohort",
                "outcome": "serum testosterone",
                "aggregate_direction": "benefit",
            },
        ]
        self.assertEqual(best_pair_verdict(claims_a, claims_b), "contradict")


class PicoCompatibleTests(SimpleTestCase):
    def test_case_insensitive(self):
        self.assertTrue(
            pico_compatible(
                "Zinc",
                "zinc",
                "Healthy adults",
                "healthy adults",
                "Serum testosterone",
                "serum testosterone",
            )
        )
