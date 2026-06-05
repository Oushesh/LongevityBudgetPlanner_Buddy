from pydantic import ValidationError as PydanticValidationError
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from coa.schemas import CompareRequest
from coa.services import CompareService, TrustScoreService
from coa.models import Brand, Product


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "supplements-buddy"})


class BrandSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "")
        limit = min(int(request.query_params.get("limit", 10)), 25)
        results = CompareService.search_brands(query, limit=limit)
        return Response([r.model_dump() for r in results])


class BrandDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        brand = Brand.objects.filter(slug=slug).first()
        if not brand:
            return Response({"detail": "Brand not found."}, status=status.HTTP_404_NOT_FOUND)

        products = []
        for product in brand.products.select_related("brand").order_by("name"):
            scored = TrustScoreService.score_product(product)
            products.append(
                {
                    "slug": product.slug,
                    "name": product.name,
                    "category": product.category,
                    "trust_score": scored.trust_score if scored else None,
                }
            )

        return Response(
            {
                "slug": brand.slug,
                "name": brand.name,
                "website": brand.website,
                "description": brand.description,
                "products": products,
            }
        )


class CompareView(APIView):
    """POST body: { "queries": ["olvlimits", "getsoloio", "blueprint"] }"""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            body = CompareRequest.model_validate(request.data)
        except PydanticValidationError as exc:
            return Response(
                {"detail": exc.errors()},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = CompareService.compare(body)
        payload = result.model_dump(mode="json")

        if not result.products:
            return Response(
                {
                    **payload,
                    "detail": "No matching products with COA data found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(payload)


class ProductDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, brand_slug, product_slug):
        product = (
            Product.objects.select_related("brand")
            .filter(brand__slug=brand_slug, slug=product_slug)
            .first()
        )
        if not product:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        scored = TrustScoreService.score_product(product)
        if not scored:
            return Response(
                {"detail": "No COA data available for this product."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(scored.model_dump(mode="json"))
