from __future__ import annotations

from django.db.models import Count, Q

from coa.models import Brand, Product
from coa.schemas import (
    BrandSearchResult,
    ChartSeries,
    CompareRequest,
    CompareResponse,
    ComparisonChart,
)
from coa.services.scoring import TrustScoreService


class CompareService:
    @staticmethod
    def search_brands(query: str, limit: int = 10) -> list[BrandSearchResult]:
        q = query.strip()
        if not q:
            return []

        brands = (
            Brand.objects.annotate(product_count=Count("products"))
            .filter(
                Q(name__icontains=q)
                | Q(slug__icontains=q)
                | Q(aliases__icontains=q)
            )
            .order_by("name")[:limit]
        )

        results: list[BrandSearchResult] = []
        for brand in brands:
            top = brand.products.order_by("name").first()
            results.append(
                BrandSearchResult(
                    slug=brand.slug,
                    name=brand.name,
                    product_count=brand.product_count,
                    top_product=top.name if top else None,
                )
            )
        return results

    @staticmethod
    def resolve_brand(query: str) -> Brand | None:
        q = query.strip().lower()
        if not q:
            return None

        exact = Brand.objects.filter(slug__iexact=q).first()
        if exact:
            return exact

        return (
            Brand.objects.filter(
                Q(name__icontains=q)
                | Q(slug__icontains=q)
                | Q(aliases__icontains=q)
            )
            .order_by("name")
            .first()
        )

    @classmethod
    def compare(cls, request: CompareRequest) -> CompareResponse:
        products: list = []
        not_found: list[str] = []
        category_labels: list[str] = []

        for query in request.queries:
            brand = cls.resolve_brand(query)
            if not brand:
                not_found.append(query)
                continue

            product = (
                Product.objects.filter(brand=brand, category="olive_oil")
                .select_related("brand")
                .first()
            )
            if not product:
                not_found.append(query)
                continue

            scored = TrustScoreService.score_product(product)
            if not scored:
                not_found.append(query)
                continue

            products.append(scored)
            if not category_labels:
                category_labels = [c.name for c in scored.categories]

        series: list[ChartSeries] = []
        for product in products:
            by_name = {c.name: c.score for c in product.categories}
            series.append(
                ChartSeries(
                    name=product.brand_name,
                    data=[by_name.get(label, 0.0) for label in category_labels],
                )
            )

        chart = ComparisonChart(
            categories=category_labels,
            series=series,
        )

        return CompareResponse(
            products=products,
            chart=chart,
            not_found=not_found,
        )
