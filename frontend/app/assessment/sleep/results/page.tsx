"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, RotateCcw } from "lucide-react";
import { SLEEP_ASSESSMENT_QUESTIONS } from "@/lib/sleep-assessment/questions";
import {
  clearSleepAssessmentResult,
  loadSleepAssessmentResult,
} from "@/lib/sleep-assessment/storage";
import type { SleepAssessmentResult } from "@/lib/sleep-assessment/types";

function labelForAnswer(questionId: string, value: string): string {
  const question = SLEEP_ASSESSMENT_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return value;
  if (question.type === "choice") {
    return question.options?.find((o) => o.value === value)?.label ?? value;
  }
  if (question.type === "time") {
    const [h, m] = value.split(":");
    if (!h || !m) return value;
    const hour = Number(h);
    const period = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display}:${m} ${period}`;
  }
  if (question.unit) return `${value} ${question.unit}`;
  return value;
}

export default function SleepAssessmentResultsPage() {
  const [result, setResult] = useState<SleepAssessmentResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResult(loadSleepAssessmentResult());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F6] text-zinc-500">
        Loading results…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <Moon className="h-10 w-10 text-indigo-500" />
        <h1 className="text-xl font-semibold text-zinc-900">No results yet</h1>
        <p className="text-zinc-600">
          Complete the sleep assessment first to see your chronotype summary.
        </p>
        <Link
          href="/assessment/sleep"
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Start assessment
        </Link>
      </div>
    );
  }

  const highlightIds = [
    "lights_off_free",
    "wake_free",
    "peak_cognitive_window",
    "morning_alertness",
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F6] px-4 py-12 font-sans text-zinc-900">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          Assessment complete
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Your circadian profile
        </h1>

        <div className="mt-8 rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-indigo-600">
            {result.chronotypeLabel}
          </p>
          <p className="mt-3 text-lg leading-relaxed text-zinc-700">
            {result.chronotypeSummary}
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {result.midSleepFreeDays && (
              <div className="rounded-2xl bg-indigo-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase text-indigo-400">
                  Mid-sleep (free days)
                </dt>
                <dd className="mt-1 text-xl font-semibold text-indigo-900">
                  {result.midSleepFreeDays}
                </dd>
              </div>
            )}
            {result.sleepDurationHours !== null && (
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase text-slate-400">
                  Sleep duration (free days)
                </dt>
                <dd className="mt-1 text-xl font-semibold text-slate-900">
                  {result.sleepDurationHours} hrs
                </dd>
              </div>
            )}
          </dl>
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Key responses
          </h2>
          <ul className="mt-4 space-y-4">
            {highlightIds.map((id) => {
              const q = SLEEP_ASSESSMENT_QUESTIONS.find((item) => item.id === id);
              const raw = result.answers[id];
              if (!q || !raw) return null;
              return (
                <li key={id} className="border-b border-zinc-100 pb-4 last:border-0">
                  <p className="text-sm text-zinc-500">{q.prompt}</p>
                  <p className="mt-1 font-medium text-zinc-900">
                    {labelForAnswer(id, raw)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/assessment/sleep"
            onClick={() => clearSleepAssessmentResult()}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            <RotateCcw className="h-4 w-4" />
            Retake assessment
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
