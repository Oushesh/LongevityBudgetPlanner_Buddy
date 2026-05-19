"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import type { Standard } from "@/lib/types";

export function StandardsTable() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/compliance/standards", { auth: false })
      .then((r) => r.json())
      .then((data) => setStandards(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="mt-6 text-sm text-zinc-500">Loading standards…</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">Standard</th>
            <th className="px-4 py-3 font-medium">What it unlocks</th>
            <th className="px-4 py-3 font-medium">Region</th>
          </tr>
        </thead>
        <tbody>
          {standards.map((s) => (
            <tr key={s.id} className="border-b border-zinc-800/80">
              <td className="px-4 py-3">
                <span className="font-medium text-fuchsia-300">{s.code}</span>
                <p className="text-xs text-zinc-500">{s.name}</p>
              </td>
              <td className="px-4 py-3 text-zinc-300">{s.unlocks}</td>
              <td className="px-4 py-3 text-zinc-400">{s.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
