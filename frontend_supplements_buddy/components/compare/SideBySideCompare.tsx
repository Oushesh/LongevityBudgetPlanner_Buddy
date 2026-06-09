import Link from "next/link";
import type { ProductTrustScore } from "@/lib/types";
import { getProductImage } from "@/lib/product-images";
import { toDisplayScore } from "@/lib/score";
import { SubScoreBars } from "@/components/review/SubScoreBars";

type SideBySideCompareProps = {
  left: ProductTrustScore;
  right: ProductTrustScore;
};

function compareRows(left: ProductTrustScore, right: ProductTrustScore) {
  const keys = new Map<
    string,
    { label: string; left?: string; right?: string }
  >();

  for (const p of [left, right] as const) {
    const side = p === left ? "left" : "right";
    for (const cat of p.categories) {
      for (const ind of cat.indicators) {
        if (
          ind.key === "lab_accreditation" ||
          ind.key === "public_coa" ||
          ind.key === "lot_traceable"
        ) {
          continue;
        }
        const row = keys.get(ind.key) ?? { label: ind.label };
        row[side] = ind.raw_value;
        keys.set(ind.key, row);
      }
    }
  }

  return Array.from(keys.values());
}

function ProductColumn({
  product,
  align,
}: {
  product: ProductTrustScore;
  align: "left" | "right";
}) {
  const image = getProductImage(product.brand_slug, product.product_slug);
  const reviewHref =
    product.brand_slug === "demo"
      ? `/review/demo/${product.product_slug}`
      : `/review/${product.brand_slug}/${product.product_slug}`;

  return (
    <div
      className={`flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${
        align === "right" ? "lg:border-l-2 lg:border-l-[#1a6fd1]/30" : ""
      }`}
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.product_name}
            className="h-28 w-28 shrink-0 rounded-lg border border-slate-100 bg-slate-50 object-contain p-2"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
            No image
          </div>
        )}
        <div className="mt-4 sm:mt-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.brand_name}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {product.product_name}
          </h2>
          <p className="mt-2 text-3xl font-light text-slate-900">
            {toDisplayScore(product.trust_score).toFixed(1)}
            <span className="text-sm text-slate-500"> /100</span>
          </p>
          <Link
            href={reviewHref}
            className="mt-2 inline-block text-sm font-medium text-[#1a6fd1] hover:underline"
          >
            Full review →
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <SubScoreBars categories={product.categories} />
      </div>
    </div>
  );
}

export function SideBySideCompare({ left, right }: SideBySideCompareProps) {
  const rows = compareRows(left, right);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductColumn product={left} align="left" />
        <ProductColumn product={right} align="right" />
      </div>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold tracking-[0.15em] text-slate-700">
          KEY DATA — SIDE BY SIDE
        </h3>
        <table className="mt-4 w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="py-2 pr-4">Analyte</th>
              <th className="py-2 pr-4">{left.brand_name}</th>
              <th className="py-2">{right.brand_name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-800">
                  {row.label}
                </td>
                <td className="py-3 pr-4 text-emerald-800">{row.left ?? "—"}</td>
                <td className="py-3 text-emerald-800">{row.right ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
