import type { CategoryScore } from "@/lib/types";

type KeyDataSectionProps = {
  categories: CategoryScore[];
};

type KeyDataRow = {
  label: string;
  found: string;
  claimed: string;
  limit: string;
  status: "pass" | "fail" | "neutral";
};

const KEY_DATA_META: Record<string, { claimed: string; limit: string }> = {
  total_omega3: { claimed: "1,000 mg", limit: "≥ 95% of label" },
  total_omega6: { claimed: "900 mg", limit: "≥ 95% of label" },
  gla: { claimed: "150 mg", limit: "≥ 95% of label" },
  linoleic_acid: { claimed: "600 mg", limit: "≥ 95% of label" },
  omega6_per_serving: { claimed: "900 mg", limit: "≥ label claim" },
  pcb_count: { claimed: "0", limit: "0 hits" },
  epa: { claimed: "600 mg", limit: "≥ 95% of label" },
  dha: { claimed: "400 mg", limit: "≥ 95% of label" },
  polyphenols_mg_kg: { claimed: "800 mg/kg", limit: "≥ 500 mg/kg" },
  oleic_acid_pct: { claimed: "78%", limit: "≥ 65%" },
  lead: { claimed: "—", limit: "USP: 5.0 µg/day" },
  arsenic: { claimed: "—", limit: "USP: 15.0 µg/day" },
  mercury: { claimed: "—", limit: "USP: 15.0 µg/day" },
  cadmium: { claimed: "—", limit: "USP: 5.0 µg/day" },
  pesticide_count: { claimed: "0", limit: "0 hits" },
  peroxide_meq_kg: { claimed: "—", limit: "≤ 20 meq O₂/kg" },
  free_acidity_pct: { claimed: "—", limit: "≤ 0.8%" },
  label_polyphenol_match: { claimed: "100%", limit: "≥ 95%" },
};

function buildRows(categories: CategoryScore[]): KeyDataRow[] {
  const rows: KeyDataRow[] = [];

  for (const category of categories) {
    for (const indicator of category.indicators) {
      if (
        indicator.key === "lab_accreditation" ||
        indicator.key === "public_coa" ||
        indicator.key === "lot_traceable"
      ) {
        continue;
      }

      const meta = KEY_DATA_META[indicator.key];
      let claimed = meta?.claimed ?? "—";
      let limit = meta?.limit ?? "—";

      if (!meta && indicator.key.includes("match")) {
        claimed = "100%";
        limit = "≥ 95%";
      } else if (!meta && indicator.passed !== null) {
        limit = indicator.passed ? "Within limit" : "Exceeds limit";
      }

      rows.push({
        label: indicator.label,
        found: indicator.raw_value,
        claimed,
        limit,
        status:
          indicator.passed === true
            ? "pass"
            : indicator.passed === false
              ? "fail"
              : "neutral",
      });
    }
  }

  return rows;
}

export function KeyDataSection({ categories }: KeyDataSectionProps) {
  const rows = buildRows(categories);

  return (
    <section className="mt-10">
      <h2 className="border-b border-slate-200 pb-3 text-sm font-bold tracking-[0.15em] text-slate-700">
        KEY DATA
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3 pr-4 font-semibold">Analyte</th>
              <th className="py-3 pr-4 font-semibold">Found</th>
              <th className="py-3 pr-4 font-semibold">Claimed</th>
              <th className="py-3 font-semibold">Limit / Target</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-4 pr-4 font-medium text-slate-800">
                  {row.label}
                </td>
                <td
                  className={`py-4 pr-4 ${
                    row.status === "pass"
                      ? "text-emerald-700"
                      : row.status === "fail"
                        ? "text-red-600"
                        : "text-slate-700"
                  }`}
                >
                  {row.found}
                </td>
                <td className="py-4 pr-4 text-slate-600">{row.claimed}</td>
                <td className="py-4 text-slate-600">{row.limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
