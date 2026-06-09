import { ProductReviewPage } from "@/components/review/ProductReviewPage";
import { NUTRAVITA_OMEGA6 } from "@/lib/demo-omega6-products";
import { getProductImage } from "@/lib/product-images";

export const metadata = {
  title: "NutraVita Evening Primrose Omega-6 — Supplements Buddy Review",
  description: "Demo omega-6 review with TrustScore and COA key data.",
};

export default function NutraVitaOmega6Page() {
  return (
    <ProductReviewPage
      product={NUTRAVITA_OMEGA6}
      backLabel="OMEGA-6 COMPARE"
      backHref="/compare/side-by-side"
      imageSrc={getProductImage("demo", "nutravita-evening-primrose-omega-6")}
      productCategory="omega_6"
    />
  );
}
