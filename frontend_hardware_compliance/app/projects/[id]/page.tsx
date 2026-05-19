"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-storage";
import type {
  ComplianceProject,
  DocumentDraft,
  LabMatch,
  RequirementMapping,
  WorkflowTask,
} from "@/lib/types";

type Tab = "requirements" | "documentation" | "labs" | "timeline";

const TABS: { id: Tab; label: string }[] = [
  { id: "requirements", label: "Requirements" },
  { id: "documentation", label: "Documentation" },
  { id: "labs", label: "Labs" },
  { id: "timeline", label: "Timeline" },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    applicable: "bg-emerald-900/50 text-emerald-200",
    not_applicable: "bg-zinc-800 text-zinc-400",
    needs_review: "bg-amber-900/50 text-amber-200",
    pending: "bg-zinc-800 text-zinc-300",
    in_progress: "bg-fuchsia-900/50 text-fuchsia-200",
    done: "bg-emerald-900/50 text-emerald-200",
    blocked: "bg-red-900/50 text-red-200",
  };
  return map[status] ?? "bg-zinc-800 text-zinc-300";
}

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [tab, setTab] = useState<Tab>("requirements");
  const [project, setProject] = useState<ComplianceProject | null>(null);
  const [mappings, setMappings] = useState<RequirementMapping[]>([]);
  const [documents, setDocuments] = useState<DocumentDraft[]>([]);
  const [labs, setLabs] = useState<LabMatch[]>([]);
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const loadProject = useCallback(async () => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    const res = await apiFetch(`/compliance/projects/${projectId}`);
    if (!res.ok) {
      router.replace("/dashboard");
      return;
    }
    setProject(await res.json());
  }, [projectId, router]);

  const loadTabData = useCallback(async () => {
    const [reqRes, docRes, labRes, taskRes] = await Promise.all([
      apiFetch(`/compliance/projects/${projectId}/requirements`),
      apiFetch(`/compliance/projects/${projectId}/documents`),
      apiFetch(`/compliance/projects/${projectId}/labs`),
      apiFetch(`/compliance/projects/${projectId}/tasks`),
    ]);
    if (reqRes.ok) setMappings(await reqRes.json());
    if (docRes.ok) {
      const docs = await docRes.json();
      setDocuments(docs);
      if (docs.length && selectedDoc === null) setSelectedDoc(docs[0].id);
    }
    if (labRes.ok) setLabs(await labRes.json());
    if (taskRes.ok) setTasks(await taskRes.json());
  }, [projectId, selectedDoc]);

  useEffect(() => {
    loadProject();
    loadTabData();
  }, [loadProject, loadTabData]);

  async function runAnalyze() {
    setLoading("analyze");
    setMessage(null);
    const res = await apiFetch(`/compliance/projects/${projectId}/analyze`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(JSON.stringify(data));
      setLoading(null);
      return;
    }
    setMappings(data.mappings ?? []);
    setTasks(data.tasks ?? []);
    await loadProject();
    setMessage("Analysis complete — requirements mapped.");
    setLoading(null);
    setTab("requirements");
  }

  async function runDraftDocs() {
    setLoading("docs");
    const res = await apiFetch(
      `/compliance/projects/${projectId}/draft-docs`,
      { method: "POST" },
    );
    if (res.ok) {
      setDocuments(await res.json());
      setMessage("Documentation drafts generated.");
      setTab("documentation");
    }
    setLoading(null);
    await loadTabData();
  }

  async function runMatchLabs() {
    setLoading("labs");
    const res = await apiFetch(
      `/compliance/projects/${projectId}/match-labs`,
      { method: "POST" },
    );
    if (res.ok) {
      setLabs(await res.json());
      setMessage("Lab matches updated.");
      setTab("labs");
    }
    setLoading(null);
    await loadProject();
    await loadTabData();
  }

  async function markReviewed(mappingId: number) {
    await apiFetch(
      `/compliance/projects/${projectId}/requirements/${mappingId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ reviewed: true, status: "applicable" }),
      },
    );
    await loadTabData();
  }

  async function updateTask(taskId: number, status: string) {
    await apiFetch(`/compliance/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    await loadTabData();
  }

  if (!project) {
    return (
      <p className="px-4 py-20 text-center text-zinc-500">Loading project…</p>
    );
  }

  const activeDoc = documents.find((d) => d.id === selectedDoc) ?? documents[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Dashboard
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="mt-1 text-sm capitalize text-zinc-400">
            Status: {project.status.replace("_", " ")}
            {project.is_demo && " · Demo project"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runAnalyze}
            disabled={!!loading}
            className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-medium hover:bg-fuchsia-500 disabled:opacity-60"
          >
            {loading === "analyze" ? "Analyzing…" : "Run analysis"}
          </button>
          <button
            type="button"
            onClick={runDraftDocs}
            disabled={!!loading}
            className="rounded-md border border-zinc-600 px-3 py-2 text-sm hover:border-zinc-400 disabled:opacity-60"
          >
            {loading === "docs" ? "Drafting…" : "Draft docs"}
          </button>
          <button
            type="button"
            onClick={runMatchLabs}
            disabled={!!loading}
            className="rounded-md border border-zinc-600 px-3 py-2 text-sm hover:border-zinc-400 disabled:opacity-60"
          >
            {loading === "labs" ? "Matching…" : "Match labs"}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-md border border-fuchsia-800/60 bg-fuchsia-950/30 px-4 py-2 text-sm text-fuchsia-200">
          {message}
        </p>
      )}

      <div className="mt-8 flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-b-2 border-fuchsia-500 text-fuchsia-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "requirements" && (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            {mappings.length === 0 ? (
              <p className="p-8 text-center text-zinc-500">
                No mappings yet. Click &quot;Run analysis&quot; to map standards.
              </p>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Standard</th>
                    <th className="px-4 py-3">Clause</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Rationale</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => (
                    <tr key={m.id} className="border-b border-zinc-800/80">
                      <td className="px-4 py-3">
                        <span className="font-medium text-fuchsia-300">
                          {m.requirement.standard_code}
                        </span>
                        {m.requirement.official_url && (
                          <a
                            href={m.requirement.official_url}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-xs text-zinc-500 underline"
                          >
                            source
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.requirement.clause_id}
                        <p className="text-xs text-zinc-500">{m.requirement.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs capitalize ${statusBadge(m.status)}`}
                        >
                          {m.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="max-w-md px-4 py-3 text-zinc-400">
                        {m.rationale || m.requirement.summary}
                      </td>
                      <td className="px-4 py-3">
                        {!m.reviewed && (
                          <button
                            type="button"
                            onClick={() => markReviewed(m.id)}
                            className="text-xs text-fuchsia-400 underline"
                          >
                            Mark reviewed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "documentation" && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <ul className="space-y-1 rounded-xl border border-zinc-800 p-2">
              {documents.length === 0 ? (
                <li className="p-4 text-sm text-zinc-500">
                  No drafts. Run analysis then &quot;Draft docs&quot;.
                </li>
              ) : (
                documents.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(d.id)}
                      className={`w-full rounded px-3 py-2 text-left text-sm ${
                        selectedDoc === d.id
                          ? "bg-fuchsia-900/40 text-fuchsia-200"
                          : "hover:bg-zinc-800"
                      }`}
                    >
                      <span className="text-xs uppercase text-zinc-500">
                        {d.doc_type}
                      </span>
                      <p className="font-medium">{d.section}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              {activeDoc ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
                  {activeDoc.content_md}
                </pre>
              ) : (
                <p className="text-zinc-500">Select a section</p>
              )}
            </article>
          </div>
        )}

        {tab === "labs" && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {labs.length === 0 ? (
              <li className="col-span-2 rounded-xl border border-zinc-800 p-8 text-center text-zinc-500">
                No lab matches. Click &quot;Match labs&quot;.
              </li>
            ) : (
              labs.map((match) => (
                <li
                  key={match.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{match.lab.name}</h3>
                    <span className="rounded bg-fuchsia-900/50 px-2 py-0.5 text-sm text-fuchsia-200">
                      {(match.score * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{match.rationale}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {match.lab.regions.join(", ")} ·{" "}
                    {match.lab.accreditations.slice(0, 2).join(", ")}
                  </p>
                  {match.lab.contact_url && (
                    <a
                      href={match.lab.contact_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm text-fuchsia-400 underline"
                    >
                      Contact lab
                    </a>
                  )}
                </li>
              ))
            )}
          </ul>
        )}

        {tab === "timeline" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(["research", "documentation", "lab", "clearance"] as const).map(
              (phase) => (
                <section
                  key={phase}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
                >
                  <h3 className="text-sm font-medium uppercase tracking-wide text-fuchsia-400">
                    {phase}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {tasks
                      .filter((t) => t.phase === phase)
                      .map((t) => (
                        <li
                          key={t.id}
                          className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-sm"
                        >
                          <p className="font-medium">{t.title}</p>
                          <span
                            className={`mt-2 inline-block rounded px-2 py-0.5 text-xs capitalize ${statusBadge(t.status)}`}
                          >
                            {t.status.replace("_", " ")}
                          </span>
                          {t.status !== "done" && (
                            <button
                              type="button"
                              onClick={() => updateTask(t.id, "done")}
                              className="mt-2 block text-xs text-fuchsia-400 underline"
                            >
                              Mark done
                            </button>
                          )}
                        </li>
                      ))}
                  </ul>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
