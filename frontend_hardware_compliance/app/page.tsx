import Link from "next/link";

import { StandardsTable } from "@/components/StandardsTable";

const STEPS = [
  {
    n: "01",
    title: "Surface every requirement that applies",
    body: "Research agent maps your product to applicable standards and returns cited requirements your team can defend.",
  },
  {
    n: "02",
    title: "Assemble documentation automatically",
    body: "Draft HARA, technical file sections, and risk management docs your testing lab needs — in a fraction of the time.",
  },
  {
    n: "03",
    title: "Get matched with the right lab",
    body: "Labs specializing in your product category and compliance needs so you can move straight to testing.",
  },
  {
    n: "04",
    title: "Track the path to clearance",
    body: "Requirements, drafts, lab tasks, and status updates in one dashboard before blockers slow a deal.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-fuchsia-400">
          Hardware compliance without the consultant drag
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Get hardware compliance done in{" "}
          <span className="text-fuchsia-400">weeks</span>, not months.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Map applicable standards, draft lab-ready documentation, and connect
          with qualified testing partners — inspired by the{" "}
          <a
            href="https://getfuchsia.ai/"
            className="underline hover:text-fuchsia-300"
            target="_blank"
            rel="noreferrer"
          >
            Fuchsia
          </a>{" "}
          workflow.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-fuchsia-600 px-6 py-3 text-sm font-medium text-white hover:bg-fuchsia-500"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-zinc-700 px-6 py-3 text-sm font-medium hover:border-zinc-500"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="mt-20 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-zinc-200">
          Why teams get stuck
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          FCC, CE, UL, and more. Requirements stay unclear, owners multiply, and
          documentation stalls procurement.
        </p>
        <div className="mt-6 rounded-lg border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
          <p className="text-zinc-500">Cannot Move Forward Due to Lack of Compliance</p>
          <p className="mt-2 font-semibold text-zinc-200">Procurement review</p>
          <p className="mt-3 leading-relaxed">
            We cannot authorize deployment on the factory floor without a
            completed hazard analysis (HARA) and UL 3300 certification. Procurement
            is on hold until these compliance requirements are met.
          </p>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Know what clearance requires</h2>
        <p className="mt-2 text-zinc-400">A compliance workflow that ships.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
            >
              <p className="text-sm font-medium text-fuchsia-400">{s.n}</p>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">
          Map the standards your product must clear
        </h2>
        <StandardsTable />
      </section>
    </div>
  );
}
