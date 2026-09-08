import type { AssessmentAnswers, SleepAssessmentResult } from "./types";

function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatMinutesAsTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function computeMidSleepFreeDays(answers: AssessmentAnswers): {
  label: string | null;
  minutes: number | null;
} {
  const lightsOff = parseTimeToMinutes(answers.lights_off_free ?? "");
  const wake = parseTimeToMinutes(answers.wake_free ?? "");
  const latency = Number(answers.sleep_latency_min ?? 0);

  if (lightsOff === null || wake === null || Number.isNaN(latency)) {
    return { label: null, minutes: null };
  }

  let sleepOnset = lightsOff + latency;
  let wakeMinutes = wake;
  if (wakeMinutes <= sleepOnset) wakeMinutes += 24 * 60;

  const midSleep = sleepOnset + (wakeMinutes - sleepOnset) / 2;
  return { label: formatMinutesAsTime(midSleep), minutes: midSleep };
}

function computeSleepDurationHours(answers: AssessmentAnswers): number | null {
  const lightsOff = parseTimeToMinutes(answers.lights_off_free ?? "");
  const wake = parseTimeToMinutes(answers.wake_free ?? "");
  const latency = Number(answers.sleep_latency_min ?? 0);

  if (lightsOff === null || wake === null || Number.isNaN(latency)) return null;

  let sleepOnset = lightsOff + latency;
  let wakeMinutes = wake;
  if (wakeMinutes <= sleepOnset) wakeMinutes += 24 * 60;

  const durationMin = wakeMinutes - sleepOnset;
  return Math.round((durationMin / 60) * 10) / 10;
}

function inferChronotype(midSleepMinutes: number | null): {
  label: string;
  summary: string;
} {
  if (midSleepMinutes === null) {
    return {
      label: "Incomplete",
      summary: "Add free-day sleep and wake times to estimate chronotype.",
    };
  }

  if (midSleepMinutes < 3 * 60 + 30) {
    return {
      label: "Early chronotype",
      summary:
        "Your mid-sleep on free days is earlier than average — you likely perform best in the morning.",
    };
  }
  if (midSleepMinutes > 5 * 60 + 30) {
    return {
      label: "Late chronotype",
      summary:
        "Your mid-sleep on free days runs late — evening peak performance and delayed morning alertness are common.",
    };
  }
  return {
    label: "Intermediate chronotype",
    summary:
      "Your mid-sleep sits in the middle range — flexible scheduling with consistent light cues should work well.",
  };
}

export function buildSleepAssessmentResult(
  answers: AssessmentAnswers,
): SleepAssessmentResult {
  const midSleep = computeMidSleepFreeDays(answers);
  const { label, summary } = inferChronotype(midSleep.minutes);

  return {
    answers,
    completedAt: new Date().toISOString(),
    chronotypeLabel: label,
    chronotypeSummary: summary,
    midSleepFreeDays: midSleep.label,
    sleepDurationHours: computeSleepDurationHours(answers),
  };
}
