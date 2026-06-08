"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BrandSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/compare?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search brands e.g. Olvlimits, GetSoloIO..."
        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1a6fd1] focus:ring-2 focus:ring-[#1a6fd1]/20"
      />
      <button
        type="submit"
        className="rounded-lg bg-[#1a6fd1] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1558a8]"
      >
        Compare
      </button>
    </form>
  );
}
