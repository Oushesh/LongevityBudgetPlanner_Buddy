import type { AssessmentQuestion } from "./types";

export const SLEEP_ASSESSMENT_TITLE = "Comprehensive Sleep & Circadian Assessment";

export const SLEEP_ASSESSMENT_INTRO =
  "Clinical intake for circadian rhythm, sleep architecture, daytime alertness, and environment. About 4–6 minutes.";

export const SLEEP_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "lights_off_free",
    sectionId: "circadian",
    sectionTitle: "Circadian Timing & Chronotype",
    sectionDescription:
      "MCTQ & MEQ framework — your baseline rhythm on unconstrained days.",
    prompt:
      "On days with zero obligations, alarms, or social commitments the next day, what time do you turn off the lights to sleep?",
    type: "time",
    required: true,
  },
  {
    id: "sleep_latency_min",
    sectionId: "circadian",
    sectionTitle: "Circadian Timing & Chronotype",
    prompt:
      "On those free days, how many minutes does it take you to fall asleep after turning off the lights?",
    type: "number",
    required: true,
    min: 0,
    max: 180,
    unit: "minutes",
  },
  {
    id: "wake_free",
    sectionId: "circadian",
    sectionTitle: "Circadian Timing & Chronotype",
    prompt:
      "On those same free days, what time do you wake up spontaneously without an alarm?",
    type: "time",
    required: true,
  },
  {
    id: "morning_alertness",
    sectionId: "circadian",
    sectionTitle: "Circadian Timing & Chronotype",
    prompt:
      "During the first 30 minutes after waking, how alert do you feel without caffeine or bright light?",
    type: "scale",
    required: true,
    min: 1,
    max: 4,
    scaleLabels: {
      min: "Very groggy / not alert",
      max: "Fully alert and clear-headed",
    },
  },
  {
    id: "peak_cognitive_window",
    sectionId: "circadian",
    sectionTitle: "Circadian Timing & Chronotype",
    prompt:
      "If you had a 2-hour, high-stakes analytical exam, which window would you pick for peak cognitive performance?",
    type: "choice",
    required: true,
    options: [
      { value: "08-10", label: "08:00 AM – 10:00 AM" },
      { value: "10-12", label: "10:00 AM – 12:00 PM" },
      { value: "12-14", label: "12:00 PM – 02:00 PM" },
      { value: "14-16", label: "02:00 PM – 04:00 PM" },
      { value: "16-18", label: "04:00 PM – 06:00 PM" },
      { value: "18-20", label: "06:00 PM – 08:00 PM" },
      { value: "20-22", label: "08:00 PM – 10:00 PM" },
    ],
  },
  {
    id: "morning_hunger",
    sectionId: "circadian",
    sectionTitle: "Circadian Timing & Chronotype",
    prompt: "How soon after waking do you typically feel genuine physical hunger?",
    type: "choice",
    required: true,
    options: [
      { value: "within_30", label: "Within 30 minutes of waking" },
      { value: "30_60", label: "30 to 60 minutes after waking" },
      { value: "1_2h", label: "1 to 2 hours after waking" },
      { value: "2h_plus", label: "More than 2 hours / no morning appetite" },
    ],
  },
  {
    id: "sleep_quality",
    sectionId: "architecture",
    sectionTitle: "Sleep Architecture & Quality",
    sectionDescription: "How restorative your sleep feels night to night.",
    prompt: "Overall, how would you rate your sleep quality on free days?",
    type: "scale",
    required: true,
    min: 1,
    max: 5,
    scaleLabels: { min: "Very poor", max: "Excellent" },
  },
  {
    id: "night_awakenings",
    sectionId: "architecture",
    sectionTitle: "Sleep Architecture & Quality",
    prompt: "How often do you wake up during the night (excluding bathroom trips)?",
    type: "choice",
    required: true,
    options: [
      { value: "never", label: "Rarely or never" },
      { value: "1", label: "About once per night" },
      { value: "2_plus", label: "Two or more times per night" },
      { value: "hourly", label: "Most hours of the night" },
    ],
  },
  {
    id: "screen_before_bed",
    sectionId: "environment",
    sectionTitle: "Environment & Evening Cues",
    sectionDescription: "Light, screens, and stimulants that shift your clock.",
    prompt: "In the hour before lights out, how much screen time do you typically have?",
    type: "choice",
    required: true,
    options: [
      { value: "none", label: "None — I wind down offline" },
      { value: "under_30", label: "Under 30 minutes" },
      { value: "30_60", label: "30–60 minutes" },
      { value: "60_plus", label: "More than 60 minutes" },
    ],
  },
  {
    id: "caffeine_cutoff",
    sectionId: "environment",
    sectionTitle: "Environment & Evening Cues",
    prompt: "When is your last caffeinated drink on a typical day?",
    type: "choice",
    required: true,
    options: [
      { value: "before_noon", label: "Before 12:00 PM" },
      { value: "early_afternoon", label: "12:00 – 3:00 PM" },
      { value: "late_afternoon", label: "3:00 – 6:00 PM" },
      { value: "evening", label: "After 6:00 PM" },
      { value: "none", label: "I don't consume caffeine" },
    ],
  },
  {
    id: "morning_light",
    sectionId: "environment",
    sectionTitle: "Environment & Evening Cues",
    prompt: "Within 60 minutes of waking, do you get outdoor or bright light exposure?",
    type: "choice",
    required: true,
    options: [
      { value: "daily_30", label: "Yes — 30+ minutes most days" },
      { value: "sometimes", label: "Sometimes / less than 30 minutes" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
];
