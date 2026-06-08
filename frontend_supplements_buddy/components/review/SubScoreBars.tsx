import type { CategoryScore } from "@/lib/types";
import { toDisplayScore } from "@/lib/score";

type SubScoreBarsProps = {
  categories: CategoryScore[];
};

export function SubScoreBars({ categories }: SubScoreBarsProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-sm font-bold tracking-[0.15em] text-slate-700">
        CATEGORY SCORES
      </h2>
      <div className="space-y-4">
        {categories.map((category) => {
          const pct = toDisplayScore(category.score);
          return (
            <div key={category.slug}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">
                  {category.name}
                </span>
                <span className="text-slate-600">{pct.toFixed(1)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#1a6fd1] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
