"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  DEMO_CATALOG,
  searchCatalog,
  type CatalogEntry,
} from "@/lib/product-catalog";

type DualProductSearchProps = {
  initialA?: string;
  initialB?: string;
};

function ProductPicker({
  label,
  value,
  onChange,
  suggestions,
  onQueryChange,
}: {
  label: string;
  value: CatalogEntry | null;
  onChange: (entry: CatalogEntry | null) => void;
  suggestions: CatalogEntry[];
  onQueryChange: (q: string) => void;
}) {
  const [query, setQuery] = useState(value?.label ?? "");

  useEffect(() => {
    setQuery(value?.label ?? "");
  }, [value]);

  return (
    <div className="relative flex-1">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onQueryChange(e.target.value);
          if (!e.target.value.trim()) onChange(null);
        }}
        onFocus={() => onQueryChange(query)}
        placeholder="Search omega-6 e.g. Sunday Naturals..."
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1a6fd1] focus:ring-2 focus:ring-[#1a6fd1]/20"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {suggestions.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  onChange(entry);
                  setQuery(entry.label);
                  onQueryChange("");
                }}
              >
                {entry.label}
                {entry.category === "omega_6" && (
                  <span className="ml-2 text-xs text-[#1a6fd1]">Omega-6</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DualProductSearch({
  initialA,
  initialB,
}: DualProductSearchProps) {
  const router = useRouter();
  const [productA, setProductA] = useState<CatalogEntry | null>(
    () => DEMO_CATALOG.find((e) => e.id === initialA) ?? null,
  );
  const [productB, setProductB] = useState<CatalogEntry | null>(
    () => DEMO_CATALOG.find((e) => e.id === initialB) ?? null,
  );
  const [suggestionsA, setSuggestionsA] = useState<CatalogEntry[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<CatalogEntry[]>([]);

  const loadSuggestions = useCallback(
    async (q: string, setter: (entries: CatalogEntry[]) => void) => {
      const trimmed = q.trim();
      if (!trimmed) {
        setter(DEMO_CATALOG.filter((e) => e.category === "omega_6"));
        return;
      }
      const results = await searchCatalog(trimmed);
      setter(results);
    },
    [],
  );

  function handleCompare() {
    if (!productA || !productB) return;
    const params = new URLSearchParams({
      a: productA.id,
      b: productB.id,
    });
    router.push(`/compare/side-by-side?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-600">
        Pick two products to compare TrustScore and COA key data side by side.
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <ProductPicker
          label="Product A"
          value={productA}
          onChange={setProductA}
          suggestions={suggestionsA}
          onQueryChange={(q) => loadSuggestions(q, setSuggestionsA)}
        />
        <ProductPicker
          label="Product B"
          value={productB}
          onChange={setProductB}
          suggestions={suggestionsB}
          onQueryChange={(q) => loadSuggestions(q, setSuggestionsB)}
        />
        <button
          type="button"
          onClick={handleCompare}
          disabled={!productA || !productB}
          className="shrink-0 rounded-lg bg-[#1a6fd1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1558a8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Compare side by side
        </button>
      </div>
    </div>
  );
}
