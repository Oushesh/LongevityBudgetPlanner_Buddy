"""
End-to-end API journey: how a user gets a longevity budget plan.

Flow represented in tests (mirrors the Next.js demo app):
1. Register and log in (JWT).
2. Save profile + monthly budget + goals (what they care about).
3. Optionally browse intervention catalog (purity, trust, bioavailability scores).
4. Generate a scenario plan (conservative / balanced / aggressive).
5. Line items include ranked interventions with rationale grounded in scores.
6. Ask the coach for next-step guidance tied to that plan.
"""

from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from planner.models import InterventionOption


class BudgetPlannerUserJourneyTests(APITestCase):
    def setUp(self):
        super().setUp()
        cache.clear()
        InterventionOption.objects.create(
            name="Magnesium glycinate",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="22.00",
            quality_score="8.5",
            purity_score="9.0",
            bioavailability_score="9.1",
            trust_score="8.8",
            available_in_region="Germany",
            insurance_hint="",
        )
        InterventionOption.objects.create(
            name="Omega-3 (EPA/DHA)",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="28.00",
            quality_score="8.7",
            purity_score="8.6",
            bioavailability_score="8.5",
            trust_score="8.9",
            available_in_region="Germany",
            insurance_hint="",
        )

    def _auth(self, username: str, email: str, password: str = "journey-pass-99"):
        self.client.post(
            reverse("auth-register"),
            data={"username": username, "email": email, "password": password},
            format="json",
        )
        login = self.client.post(
            reverse("auth-login"),
            data={"username": username, "password": password},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

    def test_full_user_journey_catalog_plan_coach(self):
        self._auth("journey_user", "journey@example.com")

        interventions = self.client.get(reverse("planner-interventions"))
        self.assertEqual(interventions.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(interventions.data), 2)
        first = interventions.data[0]
        self.assertIn("purity_score", first)
        self.assertIn("bioavailability_score", first)
        self.assertIn("trust_score", first)

        save = self.client.post(
            reverse("planner-inputs"),
            data={
                "age": 42,
                "country": "Germany",
                "region": "Hamburg",
                "insurance_type": "GKV",
                "risk_preference": "balanced",
                "monthly_income": "5200.00",
                "fixed_costs": "2800.00",
                "discretionary_budget": "800.00",
                "emergency_target": "12000.00",
                "goals": ["sleep", "metabolic_health", "supplements"],
            },
            format="json",
        )
        self.assertEqual(save.status_code, status.HTTP_201_CREATED)

        plan_resp = self.client.post(
            reverse("planner-generate"),
            data={"scenario": "balanced"},
            format="json",
        )
        self.assertEqual(plan_resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("monthly_longevity_budget", plan_resp.data)
        self.assertGreater(len(plan_resp.data["line_items"]), 0)

        item = plan_resp.data["line_items"][0]
        self.assertIn("rationale", item)
        self.assertIn("purity", item["rationale"].lower())
        self.assertIn("intervention", item)
        self.assertIsNotNone(item["intervention"])
        self.assertIn("purity_score", item["intervention"])

        plan_id = plan_resp.data["id"]
        coach = self.client.post(
            reverse("coach-recommend"),
            data={
                "plan_id": plan_id,
                "user_prompt": "Prioritize sleep and evidence-based supplements.",
            },
            format="json",
        )
        self.assertEqual(coach.status_code, status.HTTP_200_OK)
        self.assertIn("actions", coach.data)
        self.assertIn("guidance", coach.data)
