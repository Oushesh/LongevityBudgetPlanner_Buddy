import type { ProductTrustScore } from "./types";

/** Demo omega-6 supplements for side-by-side compare (no API required). */

export const SUNDAY_NATURALS_OMEGA6: ProductTrustScore = {
  brand_slug: "demo",
  brand_name: "Sunday Naturals",
  product_slug: "sunday-naturals-omega-6",
  product_name: "Sunday Naturals Omega-6 GLA",
  trust_score: 8.42,
  coa_lot: "SN-GLA-24091",
  coa_test_date: "2025-11-18",
  lab_type: "Eurofins ISO 17025",
  categories: [
    {
      slug: "label_accuracy",
      name: "Label Accuracy",
      score: 8.6,
      weight: 1,
      indicators: [
        {
          key: "total_omega6",
          label: "Total Omega-6",
          score: 8.8,
          raw_value: "920 mg/serving",
          passed: true,
        },
        {
          key: "gla",
          label: "GLA (gamma-linolenic acid)",
          score: 8.5,
          raw_value: "180 mg/serving",
          passed: true,
        },
        {
          key: "linoleic_acid",
          label: "Linoleic acid",
          score: 8.4,
          raw_value: "640 mg/serving",
          passed: true,
        },
      ],
    },
    {
      slug: "product_purity",
      name: "Product Purity",
      score: 8.9,
      weight: 1,
      indicators: [
        {
          key: "lead",
          label: "Lead",
          score: 9.2,
          raw_value: "Below LOQ",
          passed: true,
        },
        {
          key: "mercury",
          label: "Mercury",
          score: 8.8,
          raw_value: "Below LOQ",
          passed: true,
        },
        {
          key: "pcb_count",
          label: "PCB count",
          score: 8.7,
          raw_value: "0 detected",
          passed: true,
        },
      ],
    },
    {
      slug: "nutritional_value",
      name: "Nutritional Value",
      score: 8.1,
      weight: 1,
      indicators: [
        {
          key: "omega6_per_serving",
          label: "Omega-6 per serving",
          score: 8.2,
          raw_value: "920 mg",
          passed: true,
        },
      ],
    },
    {
      slug: "ingredient_safety",
      name: "Ingredient Safety",
      score: 8.3,
      weight: 1,
      indicators: [
        {
          key: "oxidation",
          label: "Oxidation (peroxide value)",
          score: 8.0,
          raw_value: "4.1 meq/kg",
          passed: true,
        },
      ],
    },
    {
      slug: "projected_efficacy",
      name: "Projected Efficacy",
      score: 7.9,
      weight: 1,
      indicators: [
        {
          key: "bioavailability",
          label: "Bioavailability form",
          score: 7.8,
          raw_value: "Cold-pressed borage",
          passed: null,
        },
      ],
    },
  ],
};

export const NUTRAVITA_OMEGA6: ProductTrustScore = {
  brand_slug: "demo",
  brand_name: "NutraVita",
  product_slug: "nutravita-evening-primrose-omega-6",
  product_name: "NutraVita Evening Primrose Omega-6",
  trust_score: 7.88,
  coa_lot: "NV-EP-11202",
  coa_test_date: "2025-10-03",
  lab_type: "Third-party ISO 17025",
  categories: [
    {
      slug: "label_accuracy",
      name: "Label Accuracy",
      score: 7.6,
      weight: 1,
      indicators: [
        {
          key: "total_omega6",
          label: "Total Omega-6",
          score: 7.4,
          raw_value: "780 mg/serving",
          passed: true,
        },
        {
          key: "gla",
          label: "GLA (gamma-linolenic acid)",
          score: 7.8,
          raw_value: "130 mg/serving",
          passed: true,
        },
        {
          key: "linoleic_acid",
          label: "Linoleic acid",
          score: 7.5,
          raw_value: "580 mg/serving",
          passed: true,
        },
      ],
    },
    {
      slug: "product_purity",
      name: "Product Purity",
      score: 8.2,
      weight: 1,
      indicators: [
        {
          key: "lead",
          label: "Lead",
          score: 8.5,
          raw_value: "Below LOQ",
          passed: true,
        },
        {
          key: "mercury",
          label: "Mercury",
          score: 8.0,
          raw_value: "0.01 ppm",
          passed: true,
        },
        {
          key: "pcb_count",
          label: "PCB count",
          score: 8.1,
          raw_value: "0 detected",
          passed: true,
        },
      ],
    },
    {
      slug: "nutritional_value",
      name: "Nutritional Value",
      score: 7.7,
      weight: 1,
      indicators: [
        {
          key: "omega6_per_serving",
          label: "Omega-6 per serving",
          score: 7.6,
          raw_value: "780 mg",
          passed: true,
        },
      ],
    },
    {
      slug: "ingredient_safety",
      name: "Ingredient Safety",
      score: 7.9,
      weight: 1,
      indicators: [
        {
          key: "oxidation",
          label: "Oxidation (peroxide value)",
          score: 7.5,
          raw_value: "6.8 meq/kg",
          passed: true,
        },
      ],
    },
    {
      slug: "projected_efficacy",
      name: "Projected Efficacy",
      score: 7.4,
      weight: 1,
      indicators: [
        {
          key: "bioavailability",
          label: "Bioavailability form",
          score: 7.2,
          raw_value: "Evening primrose oil",
          passed: null,
        },
      ],
    },
  ],
};

export const OMEGA6_DEMO_PRODUCTS: ProductTrustScore[] = [
  SUNDAY_NATURALS_OMEGA6,
  NUTRAVITA_OMEGA6,
];
