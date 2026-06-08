import {
  gradeScale,
  toDisplayScore,
  toLetterGrade,
  type LetterGrade,
} from "@/lib/score";

type ScorePanelProps = {
  trustScore: number;
};

export function ScorePanel({ trustScore }: ScorePanelProps) {
  const displayScore = toDisplayScore(trustScore);
  const activeGrade = toLetterGrade(displayScore);
  const grades = gradeScale();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
        TRUSTSCORE
      </p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-5xl font-light text-slate-900">
          {displayScore.toFixed(1)}
        </span>
        <span className="pb-2 text-sm text-slate-500">of 100</span>
      </div>

      <div className="mt-5 flex gap-1">
        {grades.map((grade) => (
          <GradeCell
            key={grade}
            grade={grade}
            active={grade === activeGrade}
          />
        ))}
      </div>
    </section>
  );
}

function GradeCell({
  grade,
  active,
}: {
  grade: LetterGrade;
  active: boolean;
}) {
  return (
    <div
      className={`flex h-10 flex-1 items-center justify-center rounded text-sm font-semibold ${
        active
          ? "bg-[#1a6fd1] text-white"
          : "bg-slate-100 text-slate-400"
      }`}
    >
      {grade}
    </div>
  );
}
