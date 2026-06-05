from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class CompareRequest(BaseModel):
    """POST /api/compare/ body — up to 6 brands by slug or free-text query."""

    queries: list[str] = Field(
        min_length=1,
        max_length=6,
        description="Brand slugs or search terms, e.g. ['olvlimits', 'getsoloio']",
    )

    @field_validator("queries")
    @classmethod
    def strip_queries(cls, values: list[str]) -> list[str]:
        cleaned = [v.strip() for v in values if v.strip()]
        if not cleaned:
            raise ValueError("At least one non-empty query is required.")
        return cleaned


class BrandSearchResult(BaseModel):
    slug: str
    name: str
    product_count: int
    top_product: str | None = None


class IndicatorScore(BaseModel):
    key: str
    label: str
    score: float = Field(ge=0, le=10)
    raw_value: str
    passed: bool | None = None


class CategoryScore(BaseModel):
    slug: str
    name: str
    score: float = Field(ge=0, le=10)
    weight: float
    indicators: list[IndicatorScore]


class ProductTrustScore(BaseModel):
    brand_slug: str
    brand_name: str
    product_slug: str
    product_name: str
    trust_score: float = Field(ge=0, le=10)
    coa_lot: str | None = None
    coa_test_date: date | None = None
    lab_type: str | None = None
    categories: list[CategoryScore]


class ChartSeries(BaseModel):
    name: str
    data: list[float]


class ComparisonChart(BaseModel):
    """Grouped bar chart payload — mirrors SuppCo category breakdown."""

    chart_type: Literal["grouped_bar"] = "grouped_bar"
    categories: list[str]
    series: list[ChartSeries]
    value_suffix: str = "/10"
    y_axis_label: str = "Category score (0–10)"


class CompareResponse(BaseModel):
    products: list[ProductTrustScore]
    chart: ComparisonChart
    not_found: list[str] = Field(default_factory=list)
