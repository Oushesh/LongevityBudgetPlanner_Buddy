from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from compliance.models import ComplianceProject


class ComplianceJourneyTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        call_command("seed_standards")
        call_command("seed_requirements")
        call_command("seed_labs")

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="journey_user",
            email="journey@example.com",
            password="testpass123",
        )
        login = self.client.post(
            "/auth/login",
            {"username": "journey_user", "password": "testpass123"},
            format="json",
        )
        self.token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_health_public(self):
        client = APIClient()
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["status"], "ok")

    def test_standards_public(self):
        client = APIClient()
        res = client.get("/compliance/standards")
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.data), 0)

    def test_full_project_workflow(self):
        create = self.client.post(
            "/compliance/projects",
            {
                "name": "Test Pod",
                "profile": {
                    "description": "Wi-Fi wellness pod with battery",
                    "product_category": "wellness",
                    "target_markets": ["US", "EU"],
                    "has_rf": True,
                    "has_battery": True,
                    "is_medical": False,
                    "medical_class": "",
                    "intended_use": "Sleep wellness",
                },
            },
            format="json",
        )
        self.assertEqual(create.status_code, 201)
        project_id = create.data["id"]

        analyze = self.client.post(f"/compliance/projects/{project_id}/analyze")
        self.assertEqual(analyze.status_code, 200)
        self.assertGreater(len(analyze.data["mappings"]), 0)

        docs = self.client.post(f"/compliance/projects/{project_id}/draft-docs")
        self.assertEqual(docs.status_code, 200)
        self.assertGreater(len(docs.data), 0)

        labs = self.client.post(f"/compliance/projects/{project_id}/match-labs")
        self.assertEqual(labs.status_code, 200)
        self.assertGreater(len(labs.data), 0)

        project = ComplianceProject.objects.get(pk=project_id)
        self.assertIn(
            project.status,
            [
                ComplianceProject.Status.READY,
                ComplianceProject.Status.IN_LAB,
            ],
        )
