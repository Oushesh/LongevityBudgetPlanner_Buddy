import { formatTestDate } from "@/lib/score";

type CertificationPanelProps = {
  lot: string | null;
  testDate: string | null;
  labType: string | null;
  isPublicCoa: boolean;
};

export function CertificationPanel({
  lot,
  testDate,
  labType,
  isPublicCoa,
}: CertificationPanelProps) {
  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
        CERTIFICATIONS
      </p>

      <div className="mt-3 flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            isPublicCoa
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          COA
        </div>
        <div className="text-sm text-slate-700">
          {isPublicCoa ? (
            <p className="font-medium text-slate-900">
              Batch-specific COA available
            </p>
          ) : (
            <p className="font-medium text-slate-900">
              This product has not published a public batch COA yet.
            </p>
          )}
          {labType && (
            <p className="mt-1 text-slate-600">Testing: {labType}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm">
        <p>
          <span className="font-semibold text-slate-800">Lot:</span>{" "}
          <span className="text-slate-600">{lot ?? "—"}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-800">Tested:</span>{" "}
          <span className="text-slate-600">{formatTestDate(testDate)}</span>
        </p>
      </div>
    </section>
  );
}
