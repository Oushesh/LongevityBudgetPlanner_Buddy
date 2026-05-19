"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-storage";

const MARKETS = ["US", "EU", "DE", "Global"];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(
    "Consumer wellness device with Wi-Fi and lithium battery for US and EU markets.",
  );
  const [category, setCategory] = useState("wellness");
  const [markets, setMarkets] = useState<string[]>(["US", "EU", "DE"]);
  const [hasRf, setHasRf] = useState(true);
  const [hasBattery, setHasBattery] = useState(true);
  const [isMedical, setIsMedical] = useState(false);
  const [medicalClass, setMedicalClass] = useState("");
  const [intendedUse, setIntendedUse] = useState(
    "Home wellness monitoring — not a regulated medical device.",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) router.replace("/login");
  }, [router]);

  function toggleMarket(m: string) {
    setMarkets((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch("/compliance/projects", {
        method: "POST",
        body: JSON.stringify({
          name,
          profile: {
            description,
            product_category: category,
            target_markets: markets,
            has_rf: hasRf,
            has_battery: hasBattery,
            is_medical: isMedical,
            medical_class: medicalClass,
            intended_use: intendedUse,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(JSON.stringify(data));
        return;
      }
      router.push(`/projects/${data.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">New compliance project</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Tell us about your product and target markets. We will map standards and
        draft documentation.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Product name
          <input
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="SleepSense Pod"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Description
          <textarea
            className="min-h-[100px] rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Category
          <select
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="wellness">Wellness / consumer IoT</option>
            <option value="consumer_iot">Consumer electronics</option>
            <option value="robotics">Robotics</option>
            <option value="medical">Medical device</option>
          </select>
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Target markets</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {MARKETS.map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={markets.includes(m)}
                  onChange={() => toggleMarket(m)}
                />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasRf}
              onChange={(e) => setHasRf(e.target.checked)}
            />
            Has RF / Wi-Fi
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasBattery}
              onChange={(e) => setHasBattery(e.target.checked)}
            />
            Has battery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isMedical}
              onChange={(e) => setIsMedical(e.target.checked)}
            />
            Medical device
          </label>
        </div>
        {isMedical && (
          <label className="flex flex-col gap-1 text-sm font-medium">
            Medical class
            <input
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={medicalClass}
              onChange={(e) => setMedicalClass(e.target.value)}
              placeholder="I or II"
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm font-medium">
          Intended use
          <textarea
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={intendedUse}
            onChange={(e) => setIntendedUse(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || markets.length === 0}
            className="rounded-md bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-500 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create & open workspace"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
