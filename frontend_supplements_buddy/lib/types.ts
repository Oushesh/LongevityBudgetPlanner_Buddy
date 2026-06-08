export type IndicatorScore = {
  key: string;
  label: string;
  score: number;
  raw_value: string;
  passed: boolean | null;
};

export type CategoryScore = {
  slug: string;
  name: string;
  score: number;
  weight: number;
  indicators: IndicatorScore[];
};

export type ProductTrustScore = {
  brand_slug: string;
  brand_name: string;
  product_slug: string;
  product_name: string;
  trust_score: number;
  coa_lot: string | null;
  coa_test_date: string | null;
  lab_type: string | null;
  categories: CategoryScore[];
};

export type BrandSearchResult = {
  slug: string;
  name: string;
  product_count: number;
  top_product: string | null;
};

export type BrandDetail = {
  slug: string;
  name: string;
  website: string;
  description: string;
  products: {
    slug: string;
    name: string;
    category: string;
    trust_score: number | null;
  }[];
};

export type ChartSeries = {
  name: string;
  data: number[];
};

export type ComparisonChart = {
  chart_type: "grouped_bar";
  categories: string[];
  series: ChartSeries[];
  value_suffix: string;
  y_axis_label: string;
};

export type CompareResponse = {
  products: ProductTrustScore[];
  chart: ComparisonChart;
  not_found: string[];
};
