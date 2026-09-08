"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Moon } from "lucide-react";
import {
  SLEEP_ASSESSMENT_INTRO,
  SLEEP_ASSESSMENT_QUESTIONS,
  SLEEP_ASSESSMENT_TITLE,
} from "@/lib/sleep-assessment/questions";
import { saveSleepAssessmentResult } from "@/lib/sleep-assessment/storage";
import type { AssessmentQuestion } from "@/lib/sleep-assessment/types";

function isAnswerValid(question: AssessmentQuestion, value: string): boolean {
  if (!question.required) return true;
  if (!value.trim()) return false;

  if (question.type === "number") {
    const n = Number(value);
    if (Number.isNaN(n)) return false;
    if (question.min !== undefined && n < question.min) return false;
    if (question.max !== undefined && n > question.max) return false;
  }

  return true;
}

export default function SleepAssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showIntro, setShowIntro] = useState(true);

  const total = SLEEP_ASSESSMENT_QUESTIONS.length;
  const question = SLEEP_ASSESSMENT_QUESTIONS[step];
  const currentValue = answers[question?.id ?? ""] ?? "";
  const progress = showIntro ? 0 : ((step + 1) / total) * 100;

  const isFirstQuestionOfSection = useMemo(() => {
    if (!question) return false;
    const idx = SLEEP_ASSESSMENT_QUESTIONS.findIndex(
      (q) => q.sectionId === question.sectionId,
    );
    return idx === step;
  }, [question, step]);

  const canContinue = question ? isAnswerValid(question, currentValue) : false;

  const goNext = useCallback(() => {
    if (!question || !canContinue) return;
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    saveSleepAssessmentResult(answers);
    router.push("/assessment/sleep/results");
  }, [answers, canContinue, question, router, step, total]);

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey && canContinue && !showIntro) {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canContinue, goNext, showIntro]);

  if (showIntro) {
    return (
      <div className="flex min-h-screen flex-col bg-[#1a1f2e] text-white">
        <div className="h-1 bg-white/10">
          <div className="h-full w-0 bg-indigo-400 transition-all" />
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
            <Moon className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Clinical intake
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {SLEEP_ASSESSMENT_TITLE}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            {SLEEP_ASSESSMENT_INTRO}
          </p>
          <p className="mt-4 text-sm text-slate-400">
            {total} questions · one at a time · press Enter to continue
          </p>
          <button
            type="button"
            onClick={() => setShowIntro(false)}
            className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#1a1f2e] transition hover:bg-slate-100"
          >
            Start
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1f2e] text-white">
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-indigo-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-xs font-medium text-slate-500">
          {step + 1} / {total}
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-12 pt-4">
        {isFirstQuestionOfSection && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-300">
              {question.sectionTitle}
            </p>
            {question.sectionDescription && (
              <p className="mt-2 text-sm text-slate-400">
                {question.sectionDescription}
              </p>
            )}
          </div>
        )}

        <h2 className="text-2xl font-medium leading-snug sm:text-3xl">
          {question.prompt}
          {question.required && (
            <span className="ml-1 text-indigo-400" aria-hidden>
              *
            </span>
          )}
        </h2>

        <div className="mt-10 flex-1">
          <QuestionInput
            question={question}
            value={currentValue}
            onChange={(value) =>
              setAnswers((prev) => ({ ...prev, [question.id]: value }))
            }
          />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === total - 1 ? "See results" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-500">press Enter ↵</span>
        </div>
      </main>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: AssessmentQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  if (question.type === "time") {
    return (
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-xs rounded-xl border-2 border-white/20 bg-white/5 px-4 py-4 text-2xl text-white outline-none focus:border-indigo-400"
        autoFocus
      />
    );
  }

  if (question.type === "number") {
    return (
      <div className="flex items-end gap-3">
        <input
          type="number"
          min={question.min}
          max={question.max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[140px] rounded-xl border-2 border-white/20 bg-white/5 px-4 py-4 text-3xl text-white outline-none focus:border-indigo-400"
          autoFocus
        />
        {question.unit && (
          <span className="pb-2 text-lg text-slate-400">{question.unit}</span>
        )}
      </div>
    );
  }

  if (question.type === "scale") {
    const min = question.min ?? 1;
    const max = question.max ?? 5;
    const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <div>
        <div className="flex flex-wrap gap-3">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 text-lg font-semibold transition ${
                value === String(n)
                  ? "border-indigo-400 bg-indigo-500 text-white"
                  : "border-white/20 bg-white/5 text-white hover:border-white/40"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {question.scaleLabels && (
          <div className="mt-4 flex justify-between text-xs text-slate-400">
            <span>{question.scaleLabels.min}</span>
            <span>{question.scaleLabels.max}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {question.options?.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl border-2 px-5 py-4 text-left text-base transition ${
            value === option.value
              ? "border-indigo-400 bg-indigo-500/20 text-white"
              : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
