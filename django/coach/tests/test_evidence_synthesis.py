from django.test import SimpleTestCase

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
