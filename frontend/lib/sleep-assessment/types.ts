export type QuestionType = "time" | "number" | "scale" | "choice";

export type AssessmentQuestion = {
  id: string;
  sectionId: string;
  sectionTitle: string;
  sectionDescription?: string;
  prompt: string;
  helperText?: string;
  type: QuestionType;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
  scaleLabels?: { min: string; max: string };
};

export type AssessmentAnswers = Record<string, string>;

export type SleepAssessmentResult = {
  answers: AssessmentAnswers;
  completedAt: string;
  chronotypeLabel: string;
  chronotypeSummary: string;
  midSleepFreeDays: string | null;
  sleepDurationHours: number | null;
};

export const SLEEP_ASSESSMENT_STORAGE_KEY = "sleep-assessment-result-v1";
