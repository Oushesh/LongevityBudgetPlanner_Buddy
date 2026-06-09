import { ProductReviewPage } from "@/components/review/ProductReviewPage";
import { SUNDAY_NATURALS_OMEGA6 } from "@/lib/demo-omega6-products";
import { getProductImage } from "@/lib/product-images";

export const metadata = {
  title: "Sunday Naturals Omega-6 GLA — Supplements Buddy Review",
  description: "Demo omega-6 review with TrustScore and COA key data.",
};

export default function SundayNaturalsOmega6Page() {
  return (
    <ProductReviewPage
      product={SUNDAY_NATURALS_OMEGA6}
      backLabel="OMEGA-6 COMPARE"
      backHref="/compare/side-by-side"
      imageSrc={getProductImage("demo", "sunday-naturals-omega-6")}
      productCategory="omega_6"
    />
  );
}
