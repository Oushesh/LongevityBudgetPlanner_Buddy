/** Static demo data for /demo — mirrors seed_demo_project (SleepSense Pod). */

export const DEMO_PROJECT = {
  name: "SleepSense Pod",
  status: "in_lab",
  category: "Wellness / consumer IoT",
  markets: ["US", "EU", "DE"],
  flags: ["Wi-Fi / RF", "Lithium battery", "Non-medical"],
  description:
    "Consumer wellness sleep pod with temperature control and app connectivity.",
};

export const DEMO_REQUIREMENTS = [
  {
    id: 1,
    standard: "FCC Part 15",
    clause: "15.109",
    title: "Radiated emission limits",
    status: "applicable",
    citation: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15",
    rationale: "Matched via product tags wifi, rf and markets US.",
    confidence: 0.92,
    reviewed: true,
  },
  {
    id: 2,
    standard: "CE-RED",
    clause: "Art.3.1a",
    title: "Health and safety (RED)",
    status: "applicable",
    citation: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0053",
    rationale: "Radio equipment placed on EU market requires RED conformity.",
    confidence: 0.95,
    reviewed: true,
  },
  {
    id: 3,
    standard: "UN38.3",
    clause: "T.1-T.8",
    title: "Lithium cell/pack test sequence",
    status: "applicable",
    citation: "https://unece.org/transport/dangerous-goods",
    rationale: "Integrated lithium pack requires transport test evidence.",
    confidence: 0.88,
    reviewed: false,
  },
  {
    id: 4,
    standard: "CE-LVD",
    clause: "Annex I",
    title: "Electrical safety objectives",
    status: "needs_review",
    citation: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0035",
    rationale: "Mains-adjacent power paths — confirm voltage scope with lab.",
    confidence: 0.71,
    reviewed: false,
  },
];

export const DEMO_LABS = [
  {
    id: 1,
    name: "TÜV SÜD Product Service",
    score: 0.89,
    rank: 1,
    regions: ["EU", "DE", "US"],
    accreditations: ["Notified Body", "ISO 17025"],
    rationale:
      "Region overlap US, EU, DE; category fit wellness, rf, battery; accreditations: Notified Body, ISO 17025.",
    recommended: true,
  },
  {
    id: 2,
    name: "Eurofins E&E North America",
    score: 0.85,
    rank: 2,
    regions: ["US", "EU"],
    accreditations: ["ISO 17025", "NRTL", "Notified Body"],
    rationale:
      "Strong RF/EMC and battery scope for consumer IoT entering US and EU.",
    recommended: false,
  },
  {
    id: 3,
    name: "Element Materials Technology",
    score: 0.82,
    rank: 3,
    regions: ["US", "EU", "UK"],
    accreditations: ["ISO 17025", "A2LA"],
    rationale: "Wireless and battery certification testing across target regions.",
    recommended: false,
  },
  {
    id: 4,
    name: "Intertek Electrical & Wireless",
    score: 0.78,
    rank: 4,
    regions: ["US", "EU"],
    accreditations: ["NRTL", "Notified Body"],
    rationale: "ETL/FCC/CE path for wellness consumer electronics.",
    recommended: false,
  },
];

export const DEMO_DOCS = [
  { id: 1, type: "HARA", section: "Hazard identification", progress: 100 },
  { id: 2, type: "technical_file", section: "Applicable standards list", progress: 100 },
  { id: 3, type: "technical_file", section: "Design and manufacturing", progress: 65 },
  { id: 4, type: "labeling", section: "Labeling and IFU summary", progress: 40 },
];

export const DEMO_PHASES = [
  { phase: "01", label: "Research", status: "done" as const },
  { phase: "02", label: "Documentation", status: "done" as const },
  { phase: "03", label: "Lab match", status: "active" as const },
  { phase: "04", label: "Clearance", status: "pending" as const },
];

export const FUCHSIA_DEMO_VIDEO =
  "https://getfuchsia.ai/videos/fuchsia-homepage-LOOPv2.mp4";
