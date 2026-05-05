from django.core.management.base import BaseCommand

from planner.models import InterventionOption


SEED_OPTIONS = [
    {
        "name": "Vitamin D3 + K2",
        "category": InterventionOption.Category.SUPPLEMENT,
        "monthly_cost": "18.50",
        "quality_score": "8.6",
        "purity_score": "8.5",
        "bioavailability_score": "8.8",
        "trust_score": "8.2",
        "available_in_region": "Germany",
        "insurance_hint": "",
    },
    {
        "name": "Annual blood diagnostics panel",
        "category": InterventionOption.Category.DIAGNOSTIC,
        "monthly_cost": "25.00",
        "quality_score": "9.1",
        "purity_score": "9.0",
        "bioavailability_score": "8.5",
        "trust_score": "8.7",
        "available_in_region": "Germany",
        "insurance_hint": "PKV",
    },
    {
        "name": "Preventive physiotherapy session",
        "category": InterventionOption.Category.PREVENTION,
        "monthly_cost": "40.00",
        "quality_score": "8.8",
        "purity_score": "8.6",
        "bioavailability_score": "8.4",
        "trust_score": "8.5",
        "available_in_region": "Germany",
        "insurance_hint": "GKV",
    },
    {
        "name": "Structured strength training membership",
        "category": InterventionOption.Category.FITNESS,
        "monthly_cost": "55.00",
        "quality_score": "8.7",
        "purity_score": "8.3",
        "bioavailability_score": "8.6",
        "trust_score": "8.4",
        "available_in_region": "Germany",
        "insurance_hint": "",
    },
]


class Command(BaseCommand):
    help = "Seed default Germany-focused intervention options."

    def handle(self, *args, **options):
        created = 0
        for option in SEED_OPTIONS:
            _, was_created = InterventionOption.objects.get_or_create(
                name=option["name"],
                defaults=option,
            )
            created += int(was_created)
        self.stdout.write(
            self.style.SUCCESS(f"Seed complete. Created {created} intervention options.")
        )
