import type { Metadata } from "next";
import SleepAssessmentWizard from "@/components/assessment/SleepAssessmentWizard";

export const metadata: Metadata = {
  title: "Sleep & Circadian Assessment | Longevity Budget Planner",
  description:
    "Typeform-style clinical intake for circadian rhythm and sleep quality.",
};

export default function SleepAssessmentPage() {
  return <SleepAssessmentWizard />;
}
