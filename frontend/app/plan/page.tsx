"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { clearTokens, getAccessToken } from "@/lib/auth-storage";

type Intervention = {
  id: number;
  name: string;
  category: string;
  monthly_cost: string;
  quality_score: string;
  purity_score: string;
  bioavailability_score: string;
  trust_score: string;
};

type LineItem = {
  name: string;
  category: string;
  monthly_allocation: string;
  rationale: string;
  intervention: Intervention | null;
};

type Plan = {
  id: number;
  scenario: string;
  monthly_longevity_budget: string;
  summary: string;
  line_items: LineItem[];
};

export default function PlanPage() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [age, setAge] = useState(34);
  const [region, setRegion] = useState("Berlin");
  const [insuranceType, setInsuranceType] = useState<"GKV" | "PKV">("GKV");
  const [monthlyIncome, setMonthlyIncome] = useState("4000");
  const [fixedCosts, setFixedCosts] = useState("2200");
  const [discretionary, setDiscretionary] = useState("600");
  const [goalsText, setGoalsText] = useState("sleep, diagnostics, supplements");
  const [scenario, setScenario] = useState<
    "conservative" | "balanced" | "aggressive"
  >("balanced");

  const [catalog, setCatalog] = useState<Intervention[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [coachPrompt, setCoachPrompt] = useState(
    "What should I prioritize first on a tight budget?",
  );
  const [coachOut, setCoachOut] = useState<Record<string, unknown> | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setReady(true);
    setLoggedIn(!!getAccessToken());
  }, []);

  const logout = () => {
    clearTokens();
    setLoggedIn(false);
    setPlan(null);
    setCoachOut(null);
    setMessage("Signed out.");
  };

  const saveProfile = useCallback(async () => {
    setLoading("save");
    setMessage(null);
    const goals = goalsText
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await apiFetch("/planner/inputs", {
      method: "POST",
      body: JSON.stringify({
        age,
        country: "Germany",
        region,
        insurance_type: insuranceType,
        risk_preference: "balanced",
        monthly_income: monthlyIncome,
        fixed_costs: fixedCosts,
        discretionary_budget: discretionary,
        emergency_target: "10000.00",
        goals,
      }),
    });
    setLoading(null);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(typeof err === "string" ? err : JSON.stringify(err));
      return;
    }
    setMessage("Profile and budget saved. You can generate a plan next.");
  }, [
    age,
    region,
    insuranceType,
    monthlyIncome,
    fixedCosts,
    discretionary,
    goalsText,
  ]);

  const loadCatalog = useCallback(async () => {
    setLoading("catalog");
    setMessage(null);
    const res = await apiFetch("/planner/interventions");
    setLoading(null);
    if (!res.ok) {
      setMessage("Could not load catalog (check login and API URL).");
      return;
    }
    const data = (await res.json()) as Intervention[];
    setCatalog(data);
    setMessage(`Loaded ${data.length} interventions (compare purity / trust / bioavailability).`);
  }, []);

  const generatePlan = useCallback(async () => {
    setLoading("plan");
    setMessage(null);
    const res = await apiFetch("/planner/generate", {
      method: "POST",
      body: JSON.stringify({ scenario }),
    });
    setLoading(null);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(JSON.stringify(err));
      return;
    }
    const data = (await res.json()) as Plan;
    setPlan(data);
    setCoachOut(null);
    setMessage(null);
  }, [scenario]);

  const coach = useCallback(async () => {
    if (!plan) {
      setMessage("Generate a plan first.");
      return;
    }
    setLoading("coach");
    const res = await apiFetch("/coach/recommend", {
      method: "POST",
      body: JSON.stringify({ plan_id: plan.id, user_prompt: coachPrompt }),
    });
    setLoading(null);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(JSON.stringify(err));
      return;
    }
    setCoachOut((await res.json()) as Record<string, unknown>);
  }, [plan, coachPrompt]);

  if (!ready) {
    return null;
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="text-lg">Sign in to use the budget planner.</p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/login"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Sign in
          </Link>
          <Link href="/register" className="text-sm underline">
            Register
          </Link>
        </div>
        <Link href="/" className="mt-8 block text-sm text-zinc-500">
          ← Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Longevity budget planner
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Enter your monthly finances and goals. The API ranks protocols and
            supplements using{" "}
            <strong>trust, purity, bioavailability</strong>, and formulation
            quality per euro per month. Use the coach panel for grounded next
            steps (not medical advice).
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-zinc-500 underline"
        >
          Sign out
        </button>
      </header>

      <section className="mb-10 grid gap-6 rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-700 dark:bg-zinc-900/40">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          1. Your profile & budget
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Age
            <input
              type="number"
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min={18}
              max={120}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Region (Germany)
            <input
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Insurance
            <select
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              value={insuranceType}
              onChange={(e) =>
                setInsuranceType(e.target.value as "GKV" | "PKV")
              }
            >
              <option value="GKV">GKV</option>
              <option value="PKV">PKV</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Monthly income (EUR)
            <input
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Fixed costs (EUR)
            <input
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Longevity budget cap (EUR / mo)
            <input
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              value={discretionary}
              onChange={(e) => setDiscretionary(e.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Goals (comma-separated — tells the product what you care about; coach
          uses your plan)
          <input
            className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            value={goalsText}
            onChange={(e) => setGoalsText(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={loading === "save"}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {loading === "save" ? "Saving…" : "Save profile"}
          </button>
          <button
            type="button"
            onClick={() => void loadCatalog()}
            disabled={loading === "catalog"}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
          >
            {loading === "catalog" ? "Loading…" : "Load intervention catalog"}
          </button>
        </div>
      </section>

      {catalog.length > 0 && (
        <section className="mb-10 overflow-x-auto rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Catalog (scores 0–10)
          </h2>
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">€/mo</th>
                <th className="py-2 pr-4">Trust</th>
                <th className="py-2 pr-4">Purity</th>
                <th className="py-2 pr-4">Bioavail.</th>
                <th className="py-2">Quality</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="py-2 pr-4">{row.name}</td>
                  <td className="py-2 pr-4">{row.monthly_cost}</td>
                  <td className="py-2 pr-4">{row.trust_score}</td>
                  <td className="py-2 pr-4">{row.purity_score}</td>
                  <td className="py-2 pr-4">{row.bioavailability_score}</td>
                  <td className="py-2">{row.quality_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="mb-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          2. Generate monthly plan
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Scenario
            <select
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              value={scenario}
              onChange={(e) =>
                setScenario(
                  e.target.value as "conservative" | "balanced" | "aggressive",
                )
              }
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void generatePlan()}
            disabled={loading === "plan"}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading === "plan" ? "Generating…" : "Generate plan"}
          </button>
        </div>

        {plan && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Monthly longevity budget:{" "}
              <strong>{plan.monthly_longevity_budget} EUR</strong> ({plan.scenario}
              )
            </p>
            <p className="text-sm text-zinc-600">{plan.summary}</p>
            <ul className="space-y-4">
              {plan.line_items.map((item) => (
                <li
                  key={`${item.name}-${item.monthly_allocation}`}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div className="font-medium">
                    {item.name}{" "}
                    <span className="text-zinc-500">
                      ({item.category}) — {item.monthly_allocation} EUR/mo
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{item.rationale}</p>
                  {item.intervention && (
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-500 sm:grid-cols-4">
                      <div>
                        <dt>Trust</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.intervention.trust_score}
                        </dd>
                      </div>
                      <div>
                        <dt>Purity</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.intervention.purity_score}
                        </dd>
                      </div>
                      <div>
                        <dt>Bioavailability</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.intervention.bioavailability_score}
                        </dd>
                      </div>
                      <div>
                        <dt>Quality</dt>
                        <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.intervention.quality_score}
                        </dd>
                      </div>
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          3. Coach (grounded on your plan)
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          Future: full AI chat with your goals + budget. Today: suggestions tied
          to the line items on your plan.
        </p>
        <textarea
          className="mb-3 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          rows={3}
          value={coachPrompt}
          onChange={(e) => setCoachPrompt(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void coach()}
          disabled={loading === "coach" || !plan}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50 dark:border-zinc-600"
        >
          {loading === "coach" ? "Thinking…" : "Get coach tips"}
        </button>
        {coachOut && (
          <pre className="mt-4 overflow-x-auto rounded bg-zinc-100 p-4 text-xs dark:bg-zinc-900">
            {JSON.stringify(coachOut, null, 2)}
          </pre>
        )}
      </section>

      {message && (
        <p className="mt-6 text-sm text-zinc-600" role="status">
          {message}
        </p>
      )}

      <Link href="/" className="mt-10 inline-block text-sm text-zinc-500">
        ← Home
      </Link>
    </div>
  );
}
