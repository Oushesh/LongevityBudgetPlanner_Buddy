from django.contrib import admin

from coa.models import (
    Brand,
    CertificateOfAnalysis,
    CoaMeasurement,
    Product,
    QualityCategory,
)


class CoaMeasurementInline(admin.TabularInline):
    model = CoaMeasurement
    extra = 0


class CertificateOfAnalysisInline(admin.TabularInline):
    model = CertificateOfAnalysis
    extra = 0
    show_change_link = True


@admin.register(QualityCategory)
class QualityCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "weight", "sort_order")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "website")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug", "aliases")


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "brand", "category", "slug")
    list_filter = ("category", "brand")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CertificateOfAnalysisInline]


admin.site.register(Product, ProductAdmin)


@admin.register(CertificateOfAnalysis)
class CertificateOfAnalysisAdmin(admin.ModelAdmin):
    list_display = ("product", "lot_number", "test_date", "lab_type", "is_public", "is_primary")
    list_filter = ("lab_type", "is_public", "is_primary")
    inlines = [CoaMeasurementInline]


@admin.register(CoaMeasurement)
class CoaMeasurementAdmin(admin.ModelAdmin):
    list_display = ("indicator_label", "coa", "category", "numeric_value", "boolean_value")
    list_filter = ("category", "value_type")
