from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from compliance.models import ComplianceProject, ProductProfile
from compliance.services import (
    DocumentDraftService,
    LabMatcherService,
    ResearchAgentService,
)


class Command(BaseCommand):
    help = "Create a demo wellness IoT project with full workflow data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default="demo",
            help="Username for demo project owner (created if missing).",
        )

    def handle(self, *args, **options):
        user, _ = User.objects.get_or_create(
            username=options["username"],
            defaults={"email": f"{options['username']}@example.com"},
        )
        if not user.has_usable_password():
            user.set_password("demo-password-change-me")
            user.save()

        project, created = ComplianceProject.objects.get_or_create(
            user=user,
            name="SleepSense Pod — Demo",
            defaults={
                "status": ComplianceProject.Status.DRAFT,
                "is_demo": True,
            },
        )
        ProductProfile.objects.update_or_create(
            project=project,
            defaults={
                "description": (
                    "Consumer wellness sleep pod with Wi-Fi connectivity, "
                    "temperature control, and integrated lithium battery pack. "
                    "Marketed for sleep optimization — not a regulated medical device."
                ),
                "product_category": "wellness",
                "target_markets": ["US", "EU", "DE"],
                "has_rf": True,
                "has_battery": True,
                "is_medical": False,
                "medical_class": "",
                "intended_use": "Home wellness sleep environment monitoring and control.",
            },
        )

        ResearchAgentService().run(project)
        DocumentDraftService().generate(project)
        LabMatcherService().match(project)

        self.stdout.write(
            self.style.SUCCESS(
                f"Demo project {'created' if created else 'refreshed'}: "
                f"id={project.id} user={user.username}"
            )
        )
