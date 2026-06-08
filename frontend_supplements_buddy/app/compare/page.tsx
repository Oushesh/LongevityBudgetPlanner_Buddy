import Link from "next/link";
import { CompareChart } from "@/components/compare/CompareChart";
import { BrandSearch } from "@/components/home/BrandSearch";
import { compareBrands, FEATURED_BRANDS } from "@/lib/api";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ComparePage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  const defaultQueries = FEATURED_BRANDS.map((b) => b.slug);
  const queries = q
    ? [...defaultQueries.slice(0, 2), q]
    : defaultQueries;

  const data = await compareBrands(queries);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold text-slate-900">Compare brands</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Side-by-side TrustScore breakdown from COA data — similar to Labdoor
        category scores.
      </p>

      <div className="mt-8">
        <BrandSearch />
      </div>

      {!data || data.products.length === 0 ? (
        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-medium">Could not load comparison data.</p>
          <p className="mt-2">
            Start the Django API at{" "}
            <code className="rounded bg-amber-100 px-1">localhost:8001</code> and
            run <code className="rounded bg-amber-100 px-1">seed_olive_oil</code>.
          </p>
          <Link href="/" className="mt-4 inline-block text-[#1a6fd1] hover:underline">
            ← Back to reviews
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          {data.not_found.length > 0 && (
            <p className="mb-4 text-sm text-amber-700">
              Not found: {data.not_found.join(", ")}
            </p>
          )}
          <CompareChart data={data} />
          <div className="mt-8 flex flex-wrap gap-3">
            {data.products.map((p) => (
              <Link
                key={p.brand_slug}
                href={`/review/${p.brand_slug}/${p.product_slug}`}
                className="text-sm font-medium text-[#1a6fd1] hover:underline"
              >
                View {p.brand_name} review →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
