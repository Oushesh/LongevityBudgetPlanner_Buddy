import { ProductReviewPage } from "@/components/review/ProductReviewPage";
import {
  OMAPURE_BRAND,
  OMAPURE_DEMO,
  OMAPURE_SELLERS,
} from "@/lib/demo-products";
import { getProductImage } from "@/lib/product-images";

export const metadata = {
  title: "Omapure Omega-3 Fish Oil — Supplements Buddy Review",
  description:
    "Labdoor-style demo review: TrustScore 96.6/100 with EPA, DHA, and heavy metal key data.",
};

export default function OmapureDemoReviewPage() {
  return (
    <ProductReviewPage
      product={OMAPURE_DEMO}
      brand={OMAPURE_BRAND}
      backLabel="OMEGA-3 RANKINGS"
      backHref="/"
      imageSrc={getProductImage("demo", "omapure-omega-3-fish-oil")}
      sellers={OMAPURE_SELLERS}
      productCategory="omega_3"
    />
  );
}
