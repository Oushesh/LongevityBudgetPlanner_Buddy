from django.core.management.base import BaseCommand

from compliance.fixtures.seed_data import LABS
from compliance.models import TestingLab


class Command(BaseCommand):
    help = "Seed accredited testing labs (includes demo entries)."

    def handle(self, *args, **options):
        created = 0
        for row in LABS:
            _, was_created = TestingLab.objects.update_or_create(
                name=row["name"],
                defaults=row,
            )
            created += int(was_created)
        self.stdout.write(
            self.style.SUCCESS(f"Labs seed complete. Created {created} new rows.")
        )
