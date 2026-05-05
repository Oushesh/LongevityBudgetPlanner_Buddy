from decimal import Decimal

from django.test import TestCase

from planner.models import InterventionOption
from planner.services import score_option


class ScoreOptionTests(TestCase):
    def test_higher_trust_purity_bioavailability_rank_above_when_cost_equal(self):
        low = InterventionOption.objects.create(
            name="Budget brand D3",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="20.00",
            quality_score="7.0",
            purity_score="6.0",
            bioavailability_score="6.5",
            trust_score="6.5",
            available_in_region="Germany",
        )
        high = InterventionOption.objects.create(
            name="Third-party tested D3",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="20.00",
            quality_score="9.0",
            purity_score="9.5",
            bioavailability_score="9.2",
            trust_score="9.0",
            available_in_region="Germany",
        )
        self.assertGreater(score_option(high), score_option(low))

    def test_lower_monthly_cost_increases_value_score_when_scores_equal(self):
        cheap = InterventionOption.objects.create(
            name="Same scores cheap",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="10.00",
            quality_score="8.0",
            purity_score="8.0",
            bioavailability_score="8.0",
            trust_score="8.0",
            available_in_region="Germany",
        )
        pricey = InterventionOption.objects.create(
            name="Same scores pricey",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="40.00",
            quality_score="8.0",
            purity_score="8.0",
            bioavailability_score="8.0",
            trust_score="8.0",
            available_in_region="Germany",
        )
        self.assertGreater(score_option(cheap), score_option(pricey))
        self.assertEqual(score_option(cheap), Decimal("0.8"))
