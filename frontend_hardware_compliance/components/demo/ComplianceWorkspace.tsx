"use client";

import { useState } from "react";

import {
  DEMO_DOCS,
  DEMO_LABS,
  DEMO_PHASES,
  DEMO_PROJECT,
  DEMO_REQUIREMENTS,
} from "@/lib/demo-workspace-data";

type DemoTab = "requirements" | "documentation" | "labs" | "timeline";

const TABS: { id: DemoTab; label: string }[] = [
  { id: "requirements", label: "Requirements" },
  { id: "documentation", label: "Documentation" },
  { id: "labs", label: "Lab matches" },
  { id: "timeline", label: "Timeline" },
];

function statusClass(status: string) {
  const map: Record<string, string> = {
    applicable: "bg-emerald-500/20 text-emerald-300",
    needs_review: "bg-amber-500/20 text-amber-300",
    done: "bg-emerald-500/20 text-emerald-300",
    active: "bg-fuchsia-500/20 text-fuchsia-300",
    pending: "bg-zinc-700 text-zinc-400",
    in_progress: "bg-fuchsia-500/20 text-fuchsia-300",
  };
  return map[status] ?? "bg-zinc-700 text-zinc-400";
}

export function ComplianceWorkspace({
  defaultTab = "labs",
}: {
  defaultTab?: DemoTab;
}) {
  const [tab, setTab] = useState<DemoTab>(defaultTab);
  const [selectedLab, setSelectedLab] = useState(DEMO_LABS[0].id);

  const topLab = DEMO_LABS.find((l) => l.id === selectedLab) ?? DEMO_LABS[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
      {/* App chrome */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-500/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs text-zinc-500">
          Compliance Buddy — workspace
        </span>
      </div>

      <div className="flex min-h-[520px] flex-col lg:flex-row">
        {/* Sidebar — product + pipeline */}
        <aside className="w-full shrink-0 border-b border-zinc-800 bg-zinc-900/40 p-5 lg:w-72 lg:border-b-0 lg:border-r">
          <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-400">
            Product
          </p>
          <h2 className="mt-1 text-lg font-semibold">{DEMO_PROJECT.name}</h2>
          <p className="mt-1 text-xs capitalize text-zinc-500">
            {DEMO_PROJECT.status.replace("_", " ")}
          </p>
          <p className="mt-3 text-sm text-zinc-400">{DEMO_PROJECT.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {DEMO_PROJECT.flags.map((f) => (
              <li
                key={f}
                className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400"
              >
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            Markets: {DEMO_PROJECT.markets.join(" · ")}
          </p>

          <p className="mt-8 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Clearance path
          </p>
          <ol className="mt-3 space-y-2">
            {DEMO_PHASES.map((p) => (
              <li
                key={p.phase}
                className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm ${
                  p.status === "active"
                    ? "bg-fuchsia-950/60 ring-1 ring-fuchsia-800/50"
                    : ""
                }`}
              >
                <span className="font-mono text-xs text-fuchsia-400">
                  {p.phase}
                </span>
                <span className="flex-1 text-zinc-300">{p.label}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${statusClass(p.status)}`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ol>
        </aside>

        {/* Main workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex gap-0 overflow-x-auto border-b border-zinc-800 px-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 px-4 py-3 text-sm font-medium transition ${
                  tab === t.id
                    ? "border-b-2 border-fuchsia-500 text-fuchsia-300"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
                {t.id === "labs" && (
                  <span className="ml-2 rounded-full bg-fuchsia-600/30 px-1.5 py-0.5 text-[10px] text-fuchsia-200">
                    {DEMO_LABS.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-5">
            {tab === "requirements" && (
              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-zinc-900 text-xs text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Standard</th>
                      <th className="px-3 py-2">Clause</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_REQUIREMENTS.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t border-zinc-800/80 hover:bg-zinc-900/50"
                      >
                        <td className="px-3 py-2.5">
                          <span className="font-medium text-fuchsia-300">
                            {r.standard}
                          </span>
                          <a
                            href={r.citation}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-[10px] text-zinc-500 underline"
                          >
                            cite
                          </a>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-xs">{r.clause}</span>
                          <p className="text-xs text-zinc-500">{r.title}</p>
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded px-2 py-0.5 text-xs capitalize ${statusClass(r.status)}`}
                          >
                            {r.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-zinc-400">
                          {(r.confidence * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "documentation" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {DEMO_DOCS.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
                  >
                    <p className="text-xs uppercase text-zinc-500">{d.type}</p>
                    <p className="mt-1 font-medium">{d.section}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-fuchsia-500 transition-all"
                        style={{ width: `${d.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{d.progress}% draft</p>
                  </li>
                ))}
              </ul>
            )}

            {tab === "labs" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-fuchsia-800/50 bg-gradient-to-br from-fuchsia-950/40 to-zinc-900/80 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-400">
                    Recommended lab match
                  </p>
                  <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{topLab.name}</h3>
                      <p className="mt-2 max-w-xl text-sm text-zinc-400">
                        {topLab.rationale}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {topLab.regions.join(" · ")} —{" "}
                        {topLab.accreditations.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-semibold text-fuchsia-300">
                        {(topLab.score * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-zinc-500">match score</p>
                      <button
                        type="button"
                        className="mt-3 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
                      >
                        Request quote
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-zinc-400">
                    All matched labs (ranked)
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {DEMO_LABS.map((lab) => (
                      <li key={lab.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedLab(lab.id)}
                          className={`flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition ${
                            selectedLab === lab.id
                              ? "border-fuchsia-700 bg-fuchsia-950/30"
                              : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-mono text-sm text-fuchsia-400">
                            #{lab.rank}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="font-medium">{lab.name}</span>
                            <p className="truncate text-xs text-zinc-500">
                              {lab.rationale}
                            </p>
                          </span>
                          <span className="shrink-0 rounded bg-zinc-800 px-2 py-1 text-sm font-medium text-fuchsia-300">
                            {(lab.score * 100).toFixed(0)}%
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-zinc-600">
                  Matcher scores region overlap, product category fit, and
                  accreditations — same logic as the live API{" "}
                  <code className="text-fuchsia-500/80">POST .../match-labs</code>
                  .
                </p>
              </div>
            )}

            {tab === "timeline" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Map product to applicable standards",
                    status: "done",
                  },
                  {
                    title: "Review cited requirements with team",
                    status: "done",
                  },
                  { title: "Draft hazard analysis (HARA)", status: "done" },
                  {
                    title: "Assemble technical file for lab",
                    status: "in_progress",
                  },
                  {
                    title: "Select accredited testing partner",
                    status: "in_progress",
                  },
                  { title: "Submit samples and test plan", status: "pending" },
                ].map((task) => (
                  <div
                    key={task.title}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
                  >
                    <p className="text-sm font-medium">{task.title}</p>
                    <span
                      className={`mt-2 inline-block rounded px-2 py-0.5 text-xs capitalize ${statusClass(task.status)}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
