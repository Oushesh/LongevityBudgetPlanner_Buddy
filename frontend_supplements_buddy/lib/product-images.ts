/** Local product hero images under /public/products/ */
export const PRODUCT_IMAGES: Record<string, string> = {
  "demo/omapure-omega-3-fish-oil": "/products/omapure-omega-3.svg",
  "demo/sunday-naturals-omega-6": "/products/sunday-naturals-omega-6.svg",
  "demo/nutravita-evening-primrose-omega-6":
    "/products/nutravita-evening-primrose-omega-6.svg",
  "olvlimits/extra-virgin-polyphenol-rich": "/products/olvlimits.svg",
  "getsoloio/daily-dose-evoo": "/products/getsoloio.svg",
  "blueprint/extra-virgin-olive-oil": "/products/blueprint.svg",
};

export function getProductImage(brandSlug: string, productSlug: string): string | null {
  return PRODUCT_IMAGES[`${brandSlug}/${productSlug}`] ?? null;
}
