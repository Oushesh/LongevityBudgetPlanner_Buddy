from __future__ import annotations

from coa.models import CertificateOfAnalysis, CoaMeasurement, Product, QualityCategory
from coa.schemas import CategoryScore, IndicatorScore, ProductTrustScore


def _clamp(score: float) -> float:
    return round(max(0.0, min(10.0, score)), 1)


def _score_numeric_measurement(m: CoaMeasurement) -> tuple[float, str, bool | None]:
    if m.numeric_value is None:
        return 0.0, "—", None

    raw = f"{m.numeric_value:g}"
    if m.unit:
        raw = f"{raw} {m.unit}"

    passed: bool | None = None
    if m.pass_threshold is not None:
        # Contaminants: lower is better (threshold = max allowed).
        if m.indicator_key.endswith("_ppb") or m.indicator_key in {
            "peroxide_meq_kg",
            "pesticide_count",
        }:
            passed = m.numeric_value <= m.pass_threshold
            if m.numeric_value <= 0:
                score = 10.0
            elif m.numeric_value <= m.pass_threshold * 0.25:
                score = 9.0
            elif m.numeric_value <= m.pass_threshold * 0.5:
                score = 7.5
            elif m.numeric_value <= m.pass_threshold:
                score = 5.0
            else:
                score = 2.0
        else:
            # Actives: higher is better (threshold = minimum target).
            passed = m.numeric_value >= m.pass_threshold
            ratio = m.numeric_value / m.pass_threshold if m.pass_threshold else 1.0
            score = _clamp(ratio * 8.0 + 2.0)
    elif m.label_claim is not None and m.label_claim > 0:
        ratio = m.numeric_value / m.label_claim
        passed = ratio >= 0.95
        if ratio >= 1.0:
            score = 10.0
        elif ratio >= 0.95:
            score = 9.0
        elif ratio >= 0.85:
            score = 7.0
        elif ratio >= 0.70:
            score = 5.0
        else:
            score = 2.0
    else:
        score = 7.0 if m.numeric_value > 0 else 3.0

    return _clamp(score), raw, passed


def _score_boolean_measurement(m: CoaMeasurement) -> tuple[float, str, bool | None]:
    if m.boolean_value is None:
        return 0.0, "—", None
    raw = "Yes" if m.boolean_value else "No"
    score = 10.0 if m.boolean_value else 0.0
    return score, raw, m.boolean_value


def _score_lab_type(coa: CertificateOfAnalysis) -> float:
    mapping = {
        CertificateOfAnalysis.LabType.THIRD_PARTY: 10.0,
        CertificateOfAnalysis.LabType.IN_HOUSE_ISO: 8.0,
        CertificateOfAnalysis.LabType.IN_HOUSE: 4.0,
        CertificateOfAnalysis.LabType.UNKNOWN: 2.0,
    }
    return mapping.get(coa.lab_type, 2.0)


class TrustScoreService:
    """Compute SuppCo-style 0–10 TrustScore from COA measurements."""

    @staticmethod
    def primary_coa(product: Product) -> CertificateOfAnalysis | None:
        coa = (
            product.coas.filter(is_primary=True)
            .prefetch_related("measurements__category")
            .first()
        )
        if coa:
            return coa
        return (
            product.coas.prefetch_related("measurements__category")
            .order_by("-test_date", "-id")
            .first()
        )

    @classmethod
    def score_product(cls, product: Product) -> ProductTrustScore | None:
        coa = cls.primary_coa(product)
        if not coa:
            return None

        categories = QualityCategory.objects.all()
        category_scores: list[CategoryScore] = []

        for category in categories:
            measurements = [
                m
                for m in coa.measurements.all()
                if m.category_id == category.id
            ]
            indicators: list[IndicatorScore] = []

            for m in measurements:
                if m.value_type == CoaMeasurement.ValueType.BOOLEAN:
                    score, raw, passed = _score_boolean_measurement(m)
                else:
                    score, raw, passed = _score_numeric_measurement(m)
                indicators.append(
                    IndicatorScore(
                        key=m.indicator_key,
                        label=m.indicator_label,
                        score=score,
                        raw_value=raw,
                        passed=passed,
                    )
                )

            # COA-level transparency bonuses in testing category.
            if category.slug == "testing_transparency":
                indicators.extend(
                    [
                        IndicatorScore(
                            key="lab_accreditation",
                            label="Lab accreditation tier",
                            score=_score_lab_type(coa),
                            raw_value=coa.get_lab_type_display(),
                            passed=coa.lab_type
                            == CertificateOfAnalysis.LabType.THIRD_PARTY,
                        ),
                        IndicatorScore(
                            key="public_coa",
                            label="Public batch-specific COA",
                            score=10.0 if coa.is_public else 0.0,
                            raw_value="Available" if coa.is_public else "Not public",
                            passed=coa.is_public,
                        ),
                    ]
                )

            if not indicators:
                cat_score = 0.0
            else:
                cat_score = _clamp(
                    sum(i.score for i in indicators) / len(indicators)
                )

            category_scores.append(
                CategoryScore(
                    slug=category.slug,
                    name=category.name,
                    score=cat_score,
                    weight=category.weight,
                    indicators=indicators,
                )
            )

        total_weight = sum(c.weight for c in category_scores) or 1.0
        trust_score = _clamp(
            sum(c.score * c.weight for c in category_scores) / total_weight
        )

        return ProductTrustScore(
            brand_slug=product.brand.slug,
            brand_name=product.brand.name,
            product_slug=product.slug,
            product_name=product.name,
            trust_score=trust_score,
            coa_lot=coa.lot_number,
            coa_test_date=coa.test_date,
            lab_type=coa.get_lab_type_display(),
            categories=category_scores,
        )
