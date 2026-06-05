from django.db import models


class QualityCategory(models.Model):
    """SuppCo-style score dimension (e.g. Testing & Transparency)."""

    slug = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    weight = models.FloatField(
        default=1.0,
        help_text="Weight when computing overall TrustScore (0–10).",
    )
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "quality categories"

    def __str__(self):
        return self.name


class Brand(models.Model):
    slug = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    website = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    aliases = models.JSONField(
        default=list,
        help_text="Alternate search terms, e.g. ['solo io', 'get solo']",
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products")
    slug = models.SlugField(max_length=128)
    name = models.CharField(max_length=255)
    category = models.CharField(
        max_length=64,
        default="olive_oil",
        help_text="Product type for grouping comparisons.",
    )
    label_claims = models.JSONField(
        default=dict,
        help_text="Declared values from label, e.g. {'polyphenols_mg_kg': 500}",
    )

    class Meta:
        ordering = ["brand__name", "name"]
        unique_together = [("brand", "slug")]

    def __str__(self):
        return f"{self.brand.name} — {self.name}"


class CertificateOfAnalysis(models.Model):
    class LabType(models.TextChoices):
        THIRD_PARTY = "third_party", "Third-party ISO 17025"
        IN_HOUSE_ISO = "in_house_iso", "In-house ISO 17025"
        IN_HOUSE = "in_house", "In-house (non-accredited)"
        UNKNOWN = "unknown", "Unknown"

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="coas"
    )
    lot_number = models.CharField(max_length=128)
    test_date = models.DateField(null=True, blank=True)
    lab_name = models.CharField(max_length=255, blank=True)
    lab_type = models.CharField(
        max_length=32, choices=LabType.choices, default=LabType.UNKNOWN
    )
    is_public = models.BooleanField(
        default=False,
        help_text="Consumer can look up this lot's COA online.",
    )
    document_url = models.URLField(max_length=500, blank=True)
    is_primary = models.BooleanField(
        default=False,
        help_text="Preferred COA used for TrustScore when multiple exist.",
    )

    class Meta:
        ordering = ["-test_date", "-id"]
        verbose_name = "certificate of analysis"
        verbose_name_plural = "certificates of analysis"
        unique_together = [("product", "lot_number")]

    def __str__(self):
        return f"{self.product} lot {self.lot_number}"


class CoaMeasurement(models.Model):
    """Single analyte or quality flag from a COA."""

    class ValueType(models.TextChoices):
        NUMERIC = "numeric", "Numeric"
        BOOLEAN = "boolean", "Boolean"
        ENUM = "enum", "Enum"

    coa = models.ForeignKey(
        CertificateOfAnalysis, on_delete=models.CASCADE, related_name="measurements"
    )
    category = models.ForeignKey(
        QualityCategory,
        on_delete=models.PROTECT,
        related_name="measurements",
    )
    indicator_key = models.CharField(
        max_length=64,
        help_text="Stable key, e.g. polyphenols_mg_kg, lead_ppb",
    )
    indicator_label = models.CharField(max_length=255)
    value_type = models.CharField(
        max_length=16, choices=ValueType.choices, default=ValueType.NUMERIC
    )
    numeric_value = models.FloatField(null=True, blank=True)
    boolean_value = models.BooleanField(null=True, blank=True)
    enum_value = models.CharField(max_length=64, blank=True)
    unit = models.CharField(max_length=32, blank=True)
    label_claim = models.FloatField(
        null=True,
        blank=True,
        help_text="Declared label value for potency/accuracy checks.",
    )
    pass_threshold = models.FloatField(
        null=True,
        blank=True,
        help_text="Max allowed (contaminants) or min required (actives).",
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["category__sort_order", "indicator_label"]
        unique_together = [("coa", "indicator_key")]

    def __str__(self):
        return f"{self.indicator_label} ({self.coa.lot_number})"
