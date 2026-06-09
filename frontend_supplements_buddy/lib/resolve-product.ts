import { getProductReview } from "./api";
import { getDemoProduct, parseCatalogId } from "./product-catalog";
import type { ProductTrustScore } from "./types";

export async function resolveProductById(
  catalogId: string,
): Promise<ProductTrustScore | null> {
  const parsed = parseCatalogId(catalogId);
  if (!parsed) return null;

  if (parsed.source === "demo") {
    return getDemoProduct(parsed.brandSlug, parsed.productSlug);
  }

  return getProductReview(parsed.brandSlug, parsed.productSlug);
}
