from django.urls import path

from coa.views import (
    BrandDetailView,
    BrandSearchView,
    CompareView,
    ProductDetailView,
)

urlpatterns = [
    path("brands/search/", BrandSearchView.as_view(), name="brand-search"),
    path("brands/<slug:slug>/", BrandDetailView.as_view(), name="brand-detail"),
    path(
        "brands/<slug:brand_slug>/products/<slug:product_slug>/",
        ProductDetailView.as_view(),
        name="product-detail",
    ),
    path("compare/", CompareView.as_view(), name="compare"),
]
