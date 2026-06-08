"use client";

import type { CompareResponse } from "@/lib/types";
import { toDisplayScore } from "@/lib/score";

type CompareChartProps = {
  data: CompareResponse;
};

export function CompareChart({ data }: CompareChartProps) {
  const maxBar = 100;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {data.products.map((product) => (
          <div
            key={product.brand_slug}
            className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm"
          >
            <p className="text-sm text-slate-600">{product.brand_name}</p>
            <p className="mt-1 text-3xl font-light text-slate-900">
              {toDisplayScore(product.trust_score).toFixed(1)}
            </p>
            <p className="text-xs text-slate-500">of 100</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-sm font-bold tracking-[0.15em] text-slate-700">
          CATEGORY BREAKDOWN
        </h3>
        {data.chart.categories.map((category, catIndex) => (
          <div key={category} className="mb-5 last:mb-0">
            <p className="mb-2 text-sm font-medium text-slate-800">{category}</p>
            <div className="space-y-2">
              {data.chart.series.map((series) => {
                const value = toDisplayScore(series.data[catIndex] ?? 0);
                return (
                  <div key={series.name} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-xs text-slate-600">
                      {series.name}
                    </span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#1a6fd1]"
                        style={{ width: `${(value / maxBar) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-slate-600">
                      {value.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
