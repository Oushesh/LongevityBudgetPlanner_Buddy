from django.core.management.base import BaseCommand

from compliance.fixtures.seed_data import STANDARDS
from compliance.models import Standard


class Command(BaseCommand):
    help = "Seed hardware compliance standards catalog."

    def handle(self, *args, **options):
        created = 0
        for row in STANDARDS:
            _, was_created = Standard.objects.update_or_create(
                code=row["code"],
                defaults=row,
            )
            created += int(was_created)
        self.stdout.write(
            self.style.SUCCESS(f"Standards seed complete. Created {created} new rows.")
        )
