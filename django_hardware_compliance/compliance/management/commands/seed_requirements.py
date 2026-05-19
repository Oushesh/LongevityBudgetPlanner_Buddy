from django.core.management.base import BaseCommand

from compliance.fixtures.seed_data import REQUIREMENTS
from compliance.models import Requirement, Standard


class Command(BaseCommand):
    help = "Seed requirement clauses linked to standards."

    def handle(self, *args, **options):
        if not Standard.objects.exists():
            self.stderr.write("Run seed_standards first.")
            return
        created = 0
        for row in REQUIREMENTS:
            standard = Standard.objects.get(code=row["standard_code"])
            _, was_created = Requirement.objects.update_or_create(
                standard=standard,
                clause_id=row["clause_id"],
                defaults={
                    "title": row["title"],
                    "summary": row["summary"],
                    "severity": row["severity"],
                    "product_tags": row["product_tags"],
                    "markets": row["markets"],
                },
            )
            created += int(was_created)
        self.stdout.write(
            self.style.SUCCESS(
                f"Requirements seed complete. Created {created} new rows."
            )
        )
