export type LetterGrade = "A" | "B" | "C" | "D" | "F";

const GRADES: LetterGrade[] = ["A", "B", "C", "D", "F"];

/** Convert backend 0–10 TrustScore to Labdoor-style 0–100 display. */
export function toDisplayScore(trustScore: number): number {
  return Math.round(trustScore * 10 * 10) / 10;
}

export function toLetterGrade(displayScore: number): LetterGrade {
  if (displayScore >= 90) return "A";
  if (displayScore >= 80) return "B";
  if (displayScore >= 70) return "C";
  if (displayScore >= 60) return "D";
  return "F";
}

export function gradeScale(): LetterGrade[] {
  return GRADES;
}

export function formatTestDate(isoDate: string | null): string {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
