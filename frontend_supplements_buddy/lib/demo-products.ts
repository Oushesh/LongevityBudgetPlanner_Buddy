import type { BrandDetail, ProductTrustScore } from "./types";

/** Static Labdoor-style demo — Omapure Omega-3 Fish Oil (96.6/100). */
export const OMAPURE_DEMO: ProductTrustScore = {
  brand_slug: "demo",
  brand_name: "Omapure",
  product_slug: "omapure-omega-3-fish-oil",
  product_name: "Omapure Omega-3 Fish Oil",
  trust_score: 9.66,
  coa_lot: "C2500263",
  coa_test_date: "2025-12-06",
  lab_type: "Third-party ISO 17025",
  categories: [
    {
      slug: "label_accuracy",
      name: "Label Accuracy",
      score: 9.8,
      weight: 1,
      indicators: [
        {
          key: "total_omega3",
          label: "Total Omega-3",
          score: 9.9,
          raw_value: "1,120 mg/serving",
          passed: true,
        },
        {
          key: "epa",
          label: "EPA",
          score: 9.7,
          raw_value: "600 mg/serving",
          passed: true,
        },
        {
          key: "dha",
          label: "DHA",
          score: 9.8,
          raw_value: "400 mg/serving",
          passed: true,
        },
      ],
    },
    {
      slug: "product_purity",
      name: "Product Purity",
      score: 9.9,
      weight: 1,
      indicators: [
        {
          key: "lead",
          label: "Lead",
          score: 10,
          raw_value: "Below LOQ",
          passed: true,
        },
        {
          key: "arsenic",
          label: "Arsenic",
          score: 10,
          raw_value: "Below LOQ",
          passed: true,
        },
        {
          key: "mercury",
          label: "Mercury",
          score: 9.8,
          raw_value: "0.02 ppm",
          passed: true,
        },
        {
          key: "cadmium",
          label: "Cadmium",
          score: 10,
          raw_value: "Below LOQ",
          passed: true,
        },
      ],
    },
    {
      slug: "nutritional_value",
      name: "Nutritional Value",
      score: 9.5,
      weight: 1,
      indicators: [
        {
          key: "omega3_per_serving",
          label: "Omega-3 per serving",
          score: 9.6,
          raw_value: "1,120 mg",
          passed: true,
        },
        {
          key: "triglyceride_form",
          label: "Triglyceride form",
          score: 9.4,
          raw_value: "Yes",
          passed: true,
        },
      ],
    },
    {
      slug: "ingredient_safety",
      name: "Ingredient Safety",
      score: 9.7,
      weight: 1,
      indicators: [
        {
          key: "oxidation",
          label: "Oxidation (TOTOX)",
          score: 9.5,
          raw_value: "8.2",
          passed: true,
        },
        {
          key: "pcbs",
          label: "PCBs",
          score: 9.9,
          raw_value: "Below LOQ",
          passed: true,
        },
      ],
    },
    {
      slug: "projected_efficacy",
      name: "Projected Efficacy",
      score: 9.4,
      weight: 1,
      indicators: [
        {
          key: "epa_dha_ratio",
          label: "EPA:DHA ratio",
          score: 9.3,
          raw_value: "3:2",
          passed: true,
        },
        {
          key: "bioavailability",
          label: "Bioavailable TG form",
          score: 9.5,
          raw_value: "Confirmed",
          passed: true,
        },
      ],
    },
    {
      slug: "testing_transparency",
      name: "Testing & Transparency",
      score: 10,
      weight: 1,
      indicators: [
        {
          key: "public_coa",
          label: "Public batch-specific COA",
          score: 10,
          raw_value: "Available",
          passed: true,
        },
        {
          key: "lab_accreditation",
          label: "Lab accreditation tier",
          score: 10,
          raw_value: "Third-party ISO 17025",
          passed: true,
        },
        {
          key: "lot_traceable",
          label: "Lot-level traceability",
          score: 10,
          raw_value: "Yes",
          passed: true,
        },
      ],
    },
  ],
};

export const OMAPURE_BRAND: BrandDetail = {
  slug: "demo",
  name: "Omapure",
  website: "https://www.amazon.com/s?k=omapure+omega+3",
  description:
    "Pharmaceutical-grade fish oil with high EPA and DHA concentrations. Independently tested for label accuracy, heavy metals, and oxidation markers.",
  products: [
    {
      slug: "omapure-omega-3-fish-oil",
      name: "Omapure Omega-3 Fish Oil",
      category: "omega_3",
      trust_score: 9.66,
    },
  ],
};

export const OMAPURE_SELLERS = [
  {
    name: "Amazon",
    url: "https://www.amazon.com/s?k=omapure+omega+3+fish+oil",
    priceLabel: "From $24.99",
  },
  {
    name: "iHerb",
    url: "https://www.iherb.com/search?kw=omapure%20omega%203",
    priceLabel: "Shop iHerb",
  },
  {
    name: "Vitacost",
    url: "https://www.vitacost.com/search?search=omapure+omega+3",
    priceLabel: "Shop Vitacost",
  },
];
