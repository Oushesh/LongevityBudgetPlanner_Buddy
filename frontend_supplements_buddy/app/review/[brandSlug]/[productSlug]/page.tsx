import { notFound } from "next/navigation";
import { ProductReviewPage } from "@/components/review/ProductReviewPage";
import { getBrand, getProductReview } from "@/lib/api";
import { getProductImage } from "@/lib/product-images";

type PageProps = {
  params: Promise<{ brandSlug: string; productSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { brandSlug, productSlug } = await params;
  const product = await getProductReview(brandSlug, productSlug);
  if (!product) return { title: "Review not found" };
  return {
    title: `${product.product_name} — Supplements Buddy Review`,
    description: `COA-based TrustScore review for ${product.brand_name} ${product.product_name}.`,
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { brandSlug, productSlug } = await params;
  const [product, brand] = await Promise.all([
    getProductReview(brandSlug, productSlug),
    getBrand(brandSlug),
  ]);

  if (!product) notFound();

  return (
    <ProductReviewPage
      product={product}
      brand={brand}
      backLabel="OLIVE OIL RANKINGS"
      imageSrc={getProductImage(brandSlug, productSlug)}
      productCategory="olive_oil"
    />
  );
}
