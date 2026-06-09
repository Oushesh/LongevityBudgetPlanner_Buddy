import { OMAPURE_DEMO } from "./demo-products";
import { OMEGA6_DEMO_PRODUCTS } from "./demo-omega6-products";
import { searchBrands } from "./api";
import type { ProductTrustScore } from "./types";

export type CatalogEntry = {
  /** Stable id: demo/{brand}/{product} or api/{brand}/{product} */
  id: string;
  label: string;
  brandSlug: string;
  productSlug: string;
  category: string;
  isDemo: boolean;
};

const DEMO_PRODUCTS: ProductTrustScore[] = [
  ...OMEGA6_DEMO_PRODUCTS,
  OMAPURE_DEMO,
];

function toEntry(product: ProductTrustScore, isDemo: boolean): CatalogEntry {
  const prefix = isDemo ? "demo" : "api";
  return {
    id: `${prefix}/${product.brand_slug}/${product.product_slug}`,
    label: `${product.brand_name} — ${product.product_name}`,
    brandSlug: product.brand_slug,
    productSlug: product.product_slug,
    category: product.product_name.toLowerCase().includes("omega-6")
      ? "omega_6"
      : product.product_name.toLowerCase().includes("omega-3")
        ? "omega_3"
        : "supplement",
    isDemo,
  };
}

export const DEMO_CATALOG: CatalogEntry[] = DEMO_PRODUCTS.map((p) =>
  toEntry(p, true),
);

export function getDemoProduct(
  brandSlug: string,
  productSlug: string,
): ProductTrustScore | null {
  return (
    DEMO_PRODUCTS.find(
      (p) => p.brand_slug === brandSlug && p.product_slug === productSlug,
    ) ?? null
  );
}

export function searchDemoCatalog(query: string, limit = 12): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return DEMO_CATALOG.filter((e) => e.category === "omega_6");

  return DEMO_CATALOG.filter(
    (e) =>
      e.label.toLowerCase().includes(q) ||
      e.category.includes(q) ||
      e.brandSlug.includes(q) ||
      e.productSlug.includes(q),
  ).slice(0, limit);
}

export async function searchCatalog(
  query: string,
  limit = 12,
): Promise<CatalogEntry[]> {
  const demo = searchDemoCatalog(query, limit);
  const apiResults = await searchBrands(query);
  const apiEntries: CatalogEntry[] = apiResults.flatMap((brand) => {
    if (!brand.top_product) return [];
    return [
      {
        id: `api/${brand.slug}/${brand.top_product}`,
        label: `${brand.name} — ${brand.top_product.replace(/-/g, " ")}`,
        brandSlug: brand.slug,
        productSlug: brand.top_product,
        category: "olive_oil",
        isDemo: false,
      },
    ];
  });

  const seen = new Set<string>();
  return [...demo, ...apiEntries].filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  }).slice(0, limit);
}

export function parseCatalogId(
  id: string,
): { source: "demo" | "api"; brandSlug: string; productSlug: string } | null {
  const match = id.match(/^(demo|api)\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  return {
    source: match[1] as "demo" | "api",
    brandSlug: match[2],
    productSlug: match[3],
  };
}
