import Link from "next/link";

import { ComplianceWorkspace } from "@/components/demo/ComplianceWorkspace";
import { FuchsiaHeroVideo } from "@/components/demo/FuchsiaHeroVideo";

export const metadata = {
  title: "Demo — Compliance workspace",
  description:
    "Interactive hardware compliance demo with requirements, documentation, and lab matching.",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-fuchsia-400">
          Product demo
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          See the compliance workspace in action
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          Watch the{" "}
          <a
            href="https://getfuchsia.ai/"
            className="text-fuchsia-400 underline"
            target="_blank"
            rel="noreferrer"
          >
            Fuchsia
          </a>{" "}
          workflow, then explore our interactive workspace — including ranked lab
          matches for your product.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-500"
          >
            Build your own project
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm hover:border-zinc-500"
          >
            Sign in (demo: demo / demo-password-change-me)
          </Link>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-lg font-semibold text-zinc-200">
          Reference — Fuchsia product demo
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Looping capture from the Fuchsia homepage hero (standards mapping →
          documentation → lab partners).
        </p>
        <div className="mt-6">
          <FuchsiaHeroVideo />
        </div>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-200">
              Compliance Buddy workspace
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Interactive demo — open the <strong className="text-zinc-400">Lab matches</strong> tab
              to see ranked testing partners.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-fuchsia-400 underline hover:text-fuchsia-300"
          >
            Open live dashboard →
          </Link>
        </div>
        <div className="mt-6">
          <ComplianceWorkspace defaultTab="labs" />
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          {
            step: "01",
            title: "Requirements mapped",
            body: "12 standards screened · 4 applicable clauses cited for SleepSense Pod.",
          },
          {
            step: "02",
            title: "Docs drafted",
            body: "HARA and technical file sections generated from mapped requirements.",
          },
          {
            step: "03",
            title: "Labs matched",
            body: "TÜV SÜD ranked #1 for EU/US wellness + RF + battery scope.",
          },
        ].map((s) => (
          <article
            key={s.step}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <p className="text-xs font-medium text-fuchsia-400">{s.step}</p>
            <h3 className="mt-2 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-zinc-500">{s.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
