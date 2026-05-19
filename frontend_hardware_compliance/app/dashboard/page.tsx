"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-storage";
import type { ComplianceProject } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-zinc-700 text-zinc-200",
  analyzing: "bg-amber-900/50 text-amber-200",
  ready: "bg-emerald-900/50 text-emerald-200",
  in_lab: "bg-fuchsia-900/50 text-fuchsia-200",
  cleared: "bg-blue-900/50 text-blue-200",
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ComplianceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    const res = await apiFetch("/compliance/projects");
    if (res.status === 401) {
      router.replace("/login");
      return;
    }
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function cloneDemoHint() {
    setMessage(
      "Sign in as demo / demo-password-change-me after running seed_demo_project on the API.",
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-2 text-zinc-400">
            Track requirements, documentation, labs, and clearance tasks.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
        >
          New project
        </Link>
      </div>

      {message && (
        <p className="mt-4 rounded-md border border-fuchsia-800 bg-fuchsia-950/40 px-4 py-2 text-sm text-fuchsia-200">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-12 text-zinc-500">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <p className="text-zinc-400">No projects yet.</p>
          <Link
            href="/projects/new"
            className="mt-4 inline-block text-fuchsia-400 underline"
          >
            Create your first product
          </Link>
          <button
            type="button"
            onClick={cloneDemoHint}
            className="mt-4 block w-full text-sm text-zinc-500 hover:text-zinc-300"
          >
            Looking for the demo project?
          </button>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-fuchsia-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{p.name}</h2>
                  {p.is_demo && (
                    <span className="shrink-0 rounded bg-fuchsia-900/40 px-2 py-0.5 text-xs text-fuchsia-300">
                      Demo
                    </span>
                  )}
                </div>
                <span
                  className={`mt-3 inline-block rounded px-2 py-0.5 text-xs capitalize ${STATUS_COLORS[p.status] ?? STATUS_COLORS.draft}`}
                >
                  {p.status.replace("_", " ")}
                </span>
                <p className="mt-2 text-sm text-zinc-500">
                  {p.product_category} · {(p.target_markets ?? []).join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
