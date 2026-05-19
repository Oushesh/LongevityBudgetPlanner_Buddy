export type Standard = {
  id: number;
  code: string;
  name: string;
  region: string;
  category: string;
  unlocks: string;
  official_url: string;
};

export type RequirementMapping = {
  id: number;
  requirement: {
    id: number;
    standard_code: string;
    standard_name: string;
    official_url: string;
    clause_id: string;
    title: string;
    summary: string;
    severity: string;
  };
  status: string;
  citation: string;
  rationale: string;
  confidence: number;
  reviewed: boolean;
};

export type DocumentDraft = {
  id: number;
  doc_type: string;
  section: string;
  content_md: string;
  version: number;
  updated_at: string;
};

export type LabMatch = {
  id: number;
  lab: {
    id: number;
    name: string;
    regions: string[];
    accreditations: string[];
    categories: string[];
    contact_url: string;
    description: string;
  };
  score: number;
  rationale: string;
  status: string;
};

export type WorkflowTask = {
  id: number;
  phase: string;
  title: string;
  status: string;
  sort_order: number;
  due_at: string | null;
  blocker_note: string;
};

export type ComplianceProject = {
  id: number;
  name: string;
  status: string;
  is_demo: boolean;
  profile?: {
    description: string;
    product_category: string;
    target_markets: string[];
    has_rf: boolean;
    has_battery: boolean;
    is_medical: boolean;
    medical_class: string;
    intended_use: string;
  };
  mappings_count?: number;
  documents_count?: number;
  lab_matches_count?: number;
  product_category?: string;
  target_markets?: string[];
  created_at?: string;
  updated_at?: string;
};
