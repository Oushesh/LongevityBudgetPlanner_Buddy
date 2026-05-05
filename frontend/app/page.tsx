import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-10 px-4 py-20">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          LongevityBudgetPlanner Buddy
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Plan what to spend on healthspan — with transparent scoring.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          The Django API turns your monthly budget and goals into ranked
          protocols and supplements using{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            purity, trust, bioavailability
          </strong>
          , and formulation quality per euro. The demo Next.js app walks through
          registration → profile → catalog → generated plan → coach tips.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/register"
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium dark:border-zinc-600"
        >
          Sign in
        </Link>
        <Link
          href="/plan"
          className="rounded-md px-5 py-2.5 text-sm font-medium text-emerald-800 underline dark:text-emerald-400"
        >
          Open planner
        </Link>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          How it works (user journey)
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Account</strong> — JWT auth; your email matches the planner
            profile on the API.
          </li>
          <li>
            <strong>Goals & budget</strong> — disposable income, caps, insurance
            (GKV/PKV), and goals like sleep or diagnostics.
          </li>
          <li>
            <strong>Catalog</strong> — optional table of interventions with
            scores you can compare before committing.
          </li>
          <li>
            <strong>Plan</strong> — deterministic allocation by scenario
            (conservative / balanced / aggressive), ranked by value vs monthly
            cost.
          </li>
          <li>
            <strong>Coach</strong> — next-step guidance anchored to your plan
            (extend with a real LLM later).
          </li>
        </ol>
        <p className="mt-4 text-zinc-600 dark:text-zinc-500">
          Run the API:{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-zinc-950">
            cd django && uv run python manage.py runserver
          </code>
          <br />
          Run this UI:{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-zinc-950">
            cd frontend && npm run dev
          </code>{" "}
          — set{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-zinc-950">
            NEXT_PUBLIC_API_URL
          </code>{" "}
          in{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs dark:bg-zinc-950">
            .env.local
          </code>
          .
        </p>
      </section>
    </div>
  );
}
