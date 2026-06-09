import Link from "next/link";
import { DualProductSearch } from "@/components/compare/DualProductSearch";
import { SideBySideCompare } from "@/components/compare/SideBySideCompare";
import { resolveProductById } from "@/lib/resolve-product";

type PageProps = {
  searchParams: Promise<{ a?: string; b?: string }>;
};

export default async function SideBySideComparePage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  const [left, right] =
    a && b
      ? await Promise.all([resolveProductById(a), resolveProductById(b)])
      : [null, null];

  const showComparison = left && right;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Compare products side by side
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Choose two omega-6 supplements (or other reviewed products) and see
            TrustScores and key COA data next to each other — Labdoor-style.
          </p>
        </div>
        <Link
          href="/compare"
          className="text-sm font-medium text-[#1a6fd1] hover:underline"
        >
          Chart compare (olive oil) →
        </Link>
      </div>

      <div className="mt-8">
        <DualProductSearch initialA={a} initialB={b} />
      </div>

      {!a || !b ? (
        <div className="mt-10 text-center text-sm text-slate-500">
          <p>
            Select Product A and Product B, then click{" "}
            <strong className="text-slate-700">Compare side by side</strong>.
            Demo omega-6 products work without the API.
          </p>
          <Link
            href="/compare/side-by-side?a=demo/demo/sunday-naturals-omega-6&b=demo/demo/nutravita-evening-primrose-omega-6"
            className="mt-4 inline-block font-medium text-[#1a6fd1] hover:underline"
          >
            Try demo: Sunday Naturals vs NutraVita →
          </Link>
        </div>
      ) : !showComparison ? (
        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-medium">Could not load one or both products.</p>
          <p className="mt-2">
            Try demo picks: Sunday Naturals Omega-6 and NutraVita Evening
            Primrose Omega-6.
          </p>
        </div>
      ) : (
        <div className="mt-10">
          <SideBySideCompare left={left} right={right} />
        </div>
      )}
    </div>
  );
}
