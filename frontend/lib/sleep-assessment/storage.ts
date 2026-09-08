import { buildSleepAssessmentResult } from "./scoring";
import type { AssessmentAnswers, SleepAssessmentResult } from "./types";
import { SLEEP_ASSESSMENT_STORAGE_KEY } from "./types";

export function saveSleepAssessmentResult(
  answers: AssessmentAnswers,
): SleepAssessmentResult {
  const result = buildSleepAssessmentResult(answers);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SLEEP_ASSESSMENT_STORAGE_KEY, JSON.stringify(result));
  }
  return result;
}

export function loadSleepAssessmentResult(): SleepAssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SLEEP_ASSESSMENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SleepAssessmentResult;
  } catch {
    return null;
  }
}

export function clearSleepAssessmentResult(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SLEEP_ASSESSMENT_STORAGE_KEY);
  }
}
