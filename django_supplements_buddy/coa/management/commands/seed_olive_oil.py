from datetime import date

from django.core.management.base import BaseCommand

from coa.models import (
    Brand,
    CertificateOfAnalysis,
    CoaMeasurement,
    Product,
    QualityCategory,
)


CATEGORIES = [
    {
        "slug": "testing_transparency",
        "name": "Testing & Transparency",
        "description": "Third-party testing, public COAs, batch traceability.",
        "weight": 1.2,
        "sort_order": 1,
    },
    {
        "slug": "purity_contaminants",
        "name": "Purity & Contaminants",
        "description": "Heavy metals, pesticides, microbials from COA panels.",
        "weight": 1.0,
        "sort_order": 2,
    },
    {
        "slug": "potency_actives",
        "name": "Potency & Actives",
        "description": "Polyphenols, oleic acid, and other bioactive markers.",
        "weight": 1.1,
        "sort_order": 3,
    },
    {
        "slug": "label_accuracy",
        "name": "Label Accuracy",
        "description": "Measured actives vs label claims (SuppCo TESTED-style).",
        "weight": 1.0,
        "sort_order": 4,
    },
    {
        "slug": "freshness_quality",
        "name": "Freshness & Quality",
        "description": "Peroxide value, acidity, sensory quality proxies.",
        "weight": 0.9,
        "sort_order": 5,
    },
]


def _cat(slug: str) -> QualityCategory:
    return QualityCategory.objects.get(slug=slug)


def _add_measurements(coa: CertificateOfAnalysis, rows: list[dict]) -> None:
    for row in rows:
        CoaMeasurement.objects.update_or_create(
            coa=coa,
            indicator_key=row["key"],
            defaults={
                "category": _cat(row["category"]),
                "indicator_label": row["label"],
                "value_type": row.get("value_type", CoaMeasurement.ValueType.NUMERIC),
                "numeric_value": row.get("numeric"),
                "boolean_value": row.get("boolean"),
                "unit": row.get("unit", ""),
                "label_claim": row.get("label_claim"),
                "pass_threshold": row.get("pass_threshold"),
            },
        )


class Command(BaseCommand):
    help = "Seed olive oil brands with demo COA data for TrustScore comparison."

    def handle(self, *args, **options):
        for cat in CATEGORIES:
            QualityCategory.objects.update_or_create(
                slug=cat["slug"],
                defaults=cat,
            )

        brands = [
            {
                "slug": "olvlimits",
                "name": "Olvlimits",
                "website": "https://olvlimits.com",
                "description": "High-polyphenol EVOO positioned for longevity consumers.",
                "aliases": ["olv limits", "olv-limits"],
                "product": {
                    "slug": "extra-virgin-polyphenol-rich",
                    "name": "Extra Virgin Polyphenol-Rich Olive Oil",
                    "label_claims": {"polyphenols_mg_kg": 800, "oleic_acid_pct": 78},
                },
                "coa": {
                    "lot_number": "OLV-2025-0412",
                    "test_date": date(2025, 4, 18),
                    "lab_name": "Eurofins Food Testing",
                    "lab_type": CertificateOfAnalysis.LabType.THIRD_PARTY,
                    "is_public": True,
                    "document_url": "https://example.com/coa/olvlimits-0412.pdf",
                    "measurements": [
                        {"key": "polyphenols_mg_kg", "category": "potency_actives", "label": "Total polyphenols", "numeric": 742, "unit": "mg/kg", "label_claim": 800, "pass_threshold": 500},
                        {"key": "oleic_acid_pct", "category": "potency_actives", "label": "Oleic acid", "numeric": 76.2, "unit": "%", "label_claim": 78, "pass_threshold": 65},
                        {"key": "lead_ppb", "category": "purity_contaminants", "label": "Lead", "numeric": 8, "unit": "ppb", "pass_threshold": 40},
                        {"key": "arsenic_ppb", "category": "purity_contaminants", "label": "Arsenic", "numeric": 3, "unit": "ppb", "pass_threshold": 10},
                        {"key": "pesticide_count", "category": "purity_contaminants", "label": "Pesticide hits", "numeric": 0, "unit": "count", "pass_threshold": 0},
                        {"key": "peroxide_meq_kg", "category": "freshness_quality", "label": "Peroxide value", "numeric": 6.8, "unit": "meq O₂/kg", "pass_threshold": 20},
                        {"key": "free_acidity_pct", "category": "freshness_quality", "label": "Free acidity", "numeric": 0.28, "unit": "% oleic acid", "pass_threshold": 0.8},
                        {"key": "label_polyphenol_match", "category": "label_accuracy", "label": "Polyphenol claim ≥95%", "numeric": 92.8, "unit": "% of claim", "label_claim": 100, "pass_threshold": 95},
                        {"key": "lot_traceable", "category": "testing_transparency", "label": "Lot-level traceability", "value_type": CoaMeasurement.ValueType.BOOLEAN, "boolean": True},
                    ],
                },
            },
            {
                "slug": "getsoloio",
                "name": "GetSoloIO",
                "website": "https://getsolo.io",
                "description": "DTC olive oil brand marketed for daily polyphenol dosing.",
                "aliases": ["solo io", "get solo", "getsolo"],
                "product": {
                    "slug": "daily-dose-evoo",
                    "name": "Daily Dose Extra Virgin Olive Oil",
                    "label_claims": {"polyphenols_mg_kg": 600, "oleic_acid_pct": 75},
                },
                "coa": {
                    "lot_number": "SIO-2025-0088",
                    "test_date": date(2025, 3, 2),
                    "lab_name": "In-house QC Lab",
                    "lab_type": CertificateOfAnalysis.LabType.IN_HOUSE,
                    "is_public": False,
                    "measurements": [
                        {"key": "polyphenols_mg_kg", "category": "potency_actives", "label": "Total polyphenols", "numeric": 410, "unit": "mg/kg", "label_claim": 600, "pass_threshold": 500},
                        {"key": "oleic_acid_pct", "category": "potency_actives", "label": "Oleic acid", "numeric": 71.5, "unit": "%", "label_claim": 75, "pass_threshold": 65},
                        {"key": "lead_ppb", "category": "purity_contaminants", "label": "Lead", "numeric": 14, "unit": "ppb", "pass_threshold": 40},
                        {"key": "arsenic_ppb", "category": "purity_contaminants", "label": "Arsenic", "numeric": 5, "unit": "ppb", "pass_threshold": 10},
                        {"key": "pesticide_count", "category": "purity_contaminants", "label": "Pesticide hits", "numeric": 1, "unit": "count", "pass_threshold": 0},
                        {"key": "peroxide_meq_kg", "category": "freshness_quality", "label": "Peroxide value", "numeric": 11.2, "unit": "meq O₂/kg", "pass_threshold": 20},
                        {"key": "free_acidity_pct", "category": "freshness_quality", "label": "Free acidity", "numeric": 0.42, "unit": "% oleic acid", "pass_threshold": 0.8},
                        {"key": "label_polyphenol_match", "category": "label_accuracy", "label": "Polyphenol claim ≥95%", "numeric": 68.3, "unit": "% of claim", "label_claim": 100, "pass_threshold": 95},
                        {"key": "lot_traceable", "category": "testing_transparency", "label": "Lot-level traceability", "value_type": CoaMeasurement.ValueType.BOOLEAN, "boolean": False},
                    ],
                },
            },
            {
                "slug": "blueprint",
                "name": "Blueprint Bryan Johnson",
                "website": "https://blueprint.bryanjohnson.com",
                "description": "Bryan Johnson's Blueprint olive oil — often debated in longevity circles.",
                "aliases": ["bryan johnson", "bryan johnson snake oil", "blueprint olive oil", "bj olive oil"],
                "product": {
                    "slug": "extra-virgin-olive-oil",
                    "name": "Blueprint Extra Virgin Olive Oil",
                    "label_claims": {"polyphenols_mg_kg": 900, "oleic_acid_pct": 80},
                },
                "coa": {
                    "lot_number": "BP-2025-1201",
                    "test_date": date(2025, 12, 8),
                    "lab_name": "NSF Certified Lab (ISO 17025)",
                    "lab_type": CertificateOfAnalysis.LabType.THIRD_PARTY,
                    "is_public": True,
                    "document_url": "https://example.com/coa/blueprint-1201.pdf",
                    "measurements": [
                        {"key": "polyphenols_mg_kg", "category": "potency_actives", "label": "Total polyphenols", "numeric": 512, "unit": "mg/kg", "label_claim": 900, "pass_threshold": 500},
                        {"key": "oleic_acid_pct", "category": "potency_actives", "label": "Oleic acid", "numeric": 74.1, "unit": "%", "label_claim": 80, "pass_threshold": 65},
                        {"key": "lead_ppb", "category": "purity_contaminants", "label": "Lead", "numeric": 6, "unit": "ppb", "pass_threshold": 40},
                        {"key": "arsenic_ppb", "category": "purity_contaminants", "label": "Arsenic", "numeric": 2, "unit": "ppb", "pass_threshold": 10},
                        {"key": "pesticide_count", "category": "purity_contaminants", "label": "Pesticide hits", "numeric": 0, "unit": "count", "pass_threshold": 0},
                        {"key": "peroxide_meq_kg", "category": "freshness_quality", "label": "Peroxide value", "numeric": 9.1, "unit": "meq O₂/kg", "pass_threshold": 20},
                        {"key": "free_acidity_pct", "category": "freshness_quality", "label": "Free acidity", "numeric": 0.31, "unit": "% oleic acid", "pass_threshold": 0.8},
                        {"key": "label_polyphenol_match", "category": "label_accuracy", "label": "Polyphenol claim ≥95%", "numeric": 56.9, "unit": "% of claim", "label_claim": 100, "pass_threshold": 95},
                        {"key": "lot_traceable", "category": "testing_transparency", "label": "Lot-level traceability", "value_type": CoaMeasurement.ValueType.BOOLEAN, "boolean": True},
                    ],
                },
            },
        ]

        for entry in brands:
            brand, _ = Brand.objects.update_or_create(
                slug=entry["slug"],
                defaults={
                    "name": entry["name"],
                    "website": entry["website"],
                    "description": entry["description"],
                    "aliases": entry["aliases"],
                },
            )
            product, _ = Product.objects.update_or_create(
                brand=brand,
                slug=entry["product"]["slug"],
                defaults={
                    "name": entry["product"]["name"],
                    "category": "olive_oil",
                    "label_claims": entry["product"]["label_claims"],
                },
            )
            coa_data = entry["coa"]
            coa, _ = CertificateOfAnalysis.objects.update_or_create(
                product=product,
                lot_number=coa_data["lot_number"],
                defaults={
                    "test_date": coa_data["test_date"],
                    "lab_name": coa_data["lab_name"],
                    "lab_type": coa_data["lab_type"],
                    "is_public": coa_data.get("is_public", False),
                    "document_url": coa_data.get("document_url", ""),
                    "is_primary": True,
                },
            )
            _add_measurements(coa, coa_data["measurements"])

        self.stdout.write(self.style.SUCCESS("Seeded 3 olive oil brands with COA demo data."))
