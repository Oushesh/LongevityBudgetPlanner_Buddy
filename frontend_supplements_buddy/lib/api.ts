import type {
  BrandDetail,
  BrandSearchResult,
  CompareResponse,
  ProductTrustScore,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getApiBase(): string {
  return API_BASE;
}

export async function searchBrands(query: string): Promise<BrandSearchResult[]> {
  const data = await apiFetch<BrandSearchResult[]>(
    `/api/brands/search/?q=${encodeURIComponent(query)}&limit=12`,
  );
  return data ?? [];
}

export async function getBrand(slug: string): Promise<BrandDetail | null> {
  return apiFetch<BrandDetail>(`/api/brands/${slug}/`);
}

export async function getProductReview(
  brandSlug: string,
  productSlug: string,
): Promise<ProductTrustScore | null> {
  return apiFetch<ProductTrustScore>(
    `/api/brands/${brandSlug}/products/${productSlug}/`,
  );
}

export async function compareBrands(
  queries: string[],
): Promise<CompareResponse | null> {
  return apiFetch<CompareResponse>("/api/compare/", {
    method: "POST",
    body: JSON.stringify({ queries }),
    cache: "no-store",
  });
}

export const FEATURED_BRANDS = [
  { slug: "olvlimits", productSlug: "extra-virgin-polyphenol-rich" },
  { slug: "getsoloio", productSlug: "daily-dose-evoo" },
  { slug: "blueprint", productSlug: "extra-virgin-olive-oil" },
] as const;
