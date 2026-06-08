import Link from "next/link";
import type { BrandDetail, ProductTrustScore } from "@/lib/types";
import { getProductImage } from "@/lib/product-images";
import { BuyingOptions, BuyingOptionsButton } from "./BuyingOptions";
import { CertificationPanel } from "./CertificationPanel";
import { KeyDataSection } from "./KeyDataSection";
import { ProductImage } from "./ProductImage";
import { ScorePanel } from "./ScorePanel";
import { SubScoreBars } from "./SubScoreBars";

type Seller = { name: string; url: string; priceLabel?: string };

type ProductReviewPageProps = {
  product: ProductTrustScore;
  brand?: BrandDetail | null;
  backLabel?: string;
  backHref?: string;
  imageSrc?: string | null;
  sellers?: Seller[];
  productCategory?: string;
};

function hasPublicCoa(product: ProductTrustScore): boolean {
  return product.categories
    .flatMap((c) => c.indicators)
    .some(
      (i) =>
        i.key === "public_coa" &&
        i.raw_value.toLowerCase().includes("available"),
    );
}

function buildSellers(
  product: ProductTrustScore,
  brand?: BrandDetail | null,
): Seller[] {
  const sellers: Seller[] = [];

  if (brand?.website) {
    sellers.push({
      name: `${brand.name} Official`,
      url: brand.website,
      priceLabel: "Buy direct",
    });
  }

  sellers.push({
    name: "Amazon",
    url: `https://www.amazon.com/s?k=${encodeURIComponent(product.product_name)}`,
    priceLabel: "Search Amazon",
  });

  return sellers;
}

export function ProductReviewPage({
  product,
  brand,
  backLabel = "REVIEWS",
  backHref = "/",
  imageSrc,
  sellers,
  productCategory,
}: ProductReviewPageProps) {
  const publicCoa = hasPublicCoa(product);
  const resolvedImage =
    imageSrc ??
    getProductImage(product.brand_slug, product.product_slug);
  const category =
    productCategory ??
    brand?.products.find((p) => p.slug === product.product_slug)?.category ??
    "supplement";
  const buyingSellers = sellers ?? buildSellers(product, brand);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#1a6fd1] hover:underline"
      >
        ← {backLabel}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <ProductImage
              src={resolvedImage}
              alt={product.product_name}
              category={category}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {product.product_name}
              </h1>
              <p className="mt-2 text-lg text-slate-600">{product.brand_name}</p>
              {brand?.description && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {brand.description}
                </p>
              )}
              <div className="mt-6">
                <BuyingOptionsButton />
              </div>
            </div>
          </div>

          <CertificationPanel
            lot={product.coa_lot}
            testDate={product.coa_test_date}
            labType={product.lab_type}
            isPublicCoa={publicCoa}
          />

          <KeyDataSection categories={product.categories} />
          <BuyingOptions sellers={buyingSellers} />

          <p className="mt-10 text-xs leading-relaxed text-slate-500">
            These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat,
            cure, or prevent any disease. Scores are computed from
            batch-specific Certificate of Analysis (COA) data where available.
            LOQ = Limit of Quantitation.
          </p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <ScorePanel trustScore={product.trust_score} />
          <SubScoreBars categories={product.categories} />
        </aside>
      </div>
    </div>
  );
}
