import Link from "next/link";
import { BrandSearch } from "@/components/home/BrandSearch";
import { FeaturedReviewCard } from "@/components/home/FeaturedReviewCard";
import { FEATURED_BRANDS, getBrand, getProductReview } from "@/lib/api";
import { OMAPURE_DEMO } from "@/lib/demo-products";
import { getProductImage } from "@/lib/product-images";

export default async function HomePage() {
  const reviews = await Promise.all(
    FEATURED_BRANDS.map(async ({ slug, productSlug }) => {
      const [product, brand] = await Promise.all([
        getProductReview(slug, productSlug),
        getBrand(slug),
      ]);
      return { slug, productSlug, product, brand };
    }),
  );

  const available = reviews.filter((r) => r.product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-2xl bg-slate-900 px-6 py-12 text-white sm:px-10">
        <p className="text-xs font-semibold tracking-[0.25em] text-slate-400">
          INDEPENDENT COA TESTING
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          Supplement reviews backed by lab data
        </h1>
        <p className="mt-4 max-w-xl text-slate-300">
          Labdoor-style TrustScores from Certificates of Analysis. Compare
          omega-3, olive oil, and more.
        </p>
        <div className="mt-8">
          <BrandSearch />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Featured reviews
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Demo page works offline — olive oil reviews need the Django API.
            </p>
          </div>
          <Link
            href="/compare"
            className="text-sm font-medium text-[#1a6fd1] hover:underline"
          >
            Compare olive oil →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          <FeaturedReviewCard
            href="/review/demo/omapure-omega-3-fish-oil"
            brandName="Omapure"
            productName={OMAPURE_DEMO.product_name}
            trustScore={OMAPURE_DEMO.trust_score}
            imageSrc={getProductImage("demo", "omapure-omega-3-fish-oil")}
            badge="Demo"
          />

          {available.map(({ slug, productSlug, product, brand }) => {
            if (!product) return null;
            return (
              <FeaturedReviewCard
                key={slug}
                href={`/review/${slug}/${productSlug}`}
                brandName={brand?.name ?? product.brand_name}
                productName={product.product_name}
                trustScore={product.trust_score}
                imageSrc={getProductImage(slug, productSlug)}
              />
            );
          })}
        </div>

        {available.length === 0 && (
          <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
            Olive oil reviews unavailable — start Django at{" "}
            <code className="rounded bg-slate-100 px-1">localhost:8001</code>.
            The Omapure demo above works without the API.
          </p>
        )}
      </section>
    </div>
  );
}
