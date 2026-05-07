from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from planner.models import InterventionOption


class PlannerAndCoachApiTests(APITestCase):
    def setUp(self):
        super().setUp()
        cache.clear()

    @classmethod
    def setUpTestData(cls):
        InterventionOption.objects.create(
            name="Vitamin D3 + K2",
            category=InterventionOption.Category.SUPPLEMENT,
            monthly_cost="20.00",
            quality_score="8.6",
            trust_score="8.1",
            available_in_region="Germany",
            insurance_hint="",
        )
        InterventionOption.objects.create(
            name="Preventive physiotherapy session",
            category=InterventionOption.Category.PREVENTION,
            monthly_cost="40.00",
            quality_score="8.8",
            trust_score="8.4",
            available_in_region="Germany",
            insurance_hint="GKV",
        )

    def _register_and_authenticate(self, username, email, password="pass12345"):
        register_resp = self.client.post(
            reverse("auth-register"),
            data={"username": username, "email": email, "password": password},
            format="json",
        )
        self.assertEqual(register_resp.status_code, status.HTTP_201_CREATED)

        login_resp = self.client.post(
            reverse("auth-login"),
            data={"username": username, "password": password},
            format="json",
        )
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_resp.data['access']}"
        )

    def test_planner_generation_flow(self):
        self._register_and_authenticate("user1", "user@example.com")
        inputs_resp = self.client.post(
            reverse("planner-inputs"),
            data={
                "age": 34,
                "country": "Germany",
                "region": "Berlin",
                "insurance_type": "GKV",
                "risk_preference": "balanced",
                "monthly_income": "4000.00",
                "fixed_costs": "2200.00",
                "discretionary_budget": "900.00",
                "emergency_target": "10000.00",
                "goals": ["sleep", "diagnostics"],
            },
            format="json",
        )
        self.assertEqual(inputs_resp.status_code, status.HTTP_201_CREATED)

        generate_resp = self.client.post(
            reverse("planner-generate"),
            data={"scenario": "balanced"},
            format="json",
        )
        self.assertEqual(generate_resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("line_items", generate_resp.data)
        self.assertGreaterEqual(len(generate_resp.data["line_items"]), 1)

    def test_coach_recommendation_is_grounded(self):
        self._register_and_authenticate("coach1", "coach@example.com")
        self.client.post(
            reverse("planner-inputs"),
            data={
                "age": 41,
                "country": "Germany",
                "region": "Munich",
                "insurance_type": "GKV",
                "monthly_income": "5000.00",
                "fixed_costs": "2500.00",
                "discretionary_budget": "1200.00",
                "emergency_target": "15000.00",
            },
            format="json",
        )
        plan_resp = self.client.post(
            reverse("planner-generate"),
            data={"scenario": "conservative"},
            format="json",
        )
        plan_id = plan_resp.data["id"]

        coach_resp = self.client.post(
            reverse("coach-recommend"),
            data={"plan_id": plan_id, "user_prompt": "Prefer low-cost actions"},
            format="json",
        )
        self.assertEqual(coach_resp.status_code, status.HTTP_200_OK)
        self.assertIn("actions", coach_resp.data)
        self.assertIn("guidance", coach_resp.data)
        self.assertGreaterEqual(len(coach_resp.data["actions"]), 1)

    def test_me_endpoint_requires_authentication(self):
        response = self.client.get(reverse("auth-me"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


