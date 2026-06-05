from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

EXPECTED_CATEGORIES = [
    "Testing & Transparency",
    "Purity & Contaminants",
    "Potency & Actives",
    "Label Accuracy",
    "Freshness & Quality",
]


class SupplementsBuddyApiTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        call_command("seed_olive_oil")

    def setUp(self):
        self.client = APIClient()

    def test_health_returns_ok(self):
        res = self.client.get("/health")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["status"], "ok")
        self.assertEqual(res.data["service"], "supplements-buddy")

    def test_brand_search_finds_olvlimits(self):
        res = self.client.get("/api/brands/search/", {"q": "olv"})

        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.data), 1)
        slugs = [item["slug"] for item in res.data]
        self.assertIn("olvlimits", slugs)

    def test_brand_search_empty_query_returns_empty_list(self):
        res = self.client.get("/api/brands/search/", {"q": ""})

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, [])

    def test_brand_detail_returns_products_with_trust_score(self):
        res = self.client.get("/api/brands/olvlimits/")

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["slug"], "olvlimits")
        self.assertGreaterEqual(len(res.data["products"]), 1)
        self.assertIsNotNone(res.data["products"][0]["trust_score"])
        self.assertGreater(res.data["products"][0]["trust_score"], 0)

    def test_brand_detail_not_found(self):
        res = self.client.get("/api/brands/does-not-exist/")

        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.data["detail"], "Brand not found.")

    def test_compare_three_brands_returns_chart_payload(self):
        res = self.client.post(
            "/api/compare/",
            {
                "queries": [
                    "olvlimits",
                    "getsoloio",
                    "bryan johnson snake oil",
                ]
            },
            format="json",
        )

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["products"]), 3)
        self.assertEqual(res.data["not_found"], [])

        chart = res.data["chart"]
        self.assertEqual(chart["chart_type"], "grouped_bar")
        self.assertEqual(chart["categories"], EXPECTED_CATEGORIES)
        self.assertEqual(len(chart["series"]), 3)
        self.assertEqual(chart["value_suffix"], "/10")

        for series in chart["series"]:
            self.assertEqual(len(series["data"]), len(EXPECTED_CATEGORIES))
            for score in series["data"]:
                self.assertGreaterEqual(score, 0)
                self.assertLessEqual(score, 10)

        for product in res.data["products"]:
            self.assertGreaterEqual(product["trust_score"], 0)
            self.assertLessEqual(product["trust_score"], 10)
            self.assertEqual(len(product["categories"]), len(EXPECTED_CATEGORIES))

    def test_compare_resolves_alias_for_blueprint(self):
        res = self.client.post(
            "/api/compare/",
            {"queries": ["bryan johnson snake oil"]},
            format="json",
        )

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["products"]), 1)
        self.assertEqual(res.data["products"][0]["brand_slug"], "blueprint")

    def test_compare_rejects_empty_queries(self):
        res = self.client.post("/api/compare/", {"queries": []}, format="json")

        self.assertEqual(res.status_code, 400)
        self.assertIn("detail", res.data)

    def test_compare_reports_not_found_for_unknown_brands(self):
        res = self.client.post(
            "/api/compare/",
            {"queries": ["olvlimits", "totally-unknown-brand"]},
            format="json",
        )

        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["products"]), 1)
        self.assertEqual(res.data["not_found"], ["totally-unknown-brand"])

    def test_compare_all_unknown_returns_404(self):
        res = self.client.post(
            "/api/compare/",
            {"queries": ["unknown-one", "unknown-two"]},
            format="json",
        )

        self.assertEqual(res.status_code, 404)
        self.assertEqual(
            res.data["detail"],
            "No matching products with COA data found.",
        )
        self.assertEqual(len(res.data["products"]), 0)

    def test_product_detail_returns_full_score_breakdown(self):
        res = self.client.get(
            "/api/brands/olvlimits/products/extra-virgin-polyphenol-rich/"
        )

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["brand_slug"], "olvlimits")
        self.assertEqual(res.data["product_slug"], "extra-virgin-polyphenol-rich")
        self.assertIsNotNone(res.data["coa_lot"])
        self.assertEqual(len(res.data["categories"]), len(EXPECTED_CATEGORIES))

        for category in res.data["categories"]:
            self.assertGreaterEqual(category["score"], 0)
            self.assertLessEqual(category["score"], 10)
            self.assertGreater(len(category["indicators"]), 0)

    def test_product_detail_not_found(self):
        res = self.client.get(
            "/api/brands/olvlimits/products/does-not-exist/"
        )

        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.data["detail"], "Product not found.")
