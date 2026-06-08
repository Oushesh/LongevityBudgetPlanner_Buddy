/** Local product hero images under /public/products/ */
export const PRODUCT_IMAGES: Record<string, string> = {
  "demo/omapure-omega-3-fish-oil": "/products/omapure-omega-3.svg",
  "olvlimits/extra-virgin-polyphenol-rich": "/products/olvlimits.svg",
  "getsoloio/daily-dose-evoo": "/products/getsoloio.svg",
  "blueprint/extra-virgin-olive-oil": "/products/blueprint.svg",
};

export function getProductImage(brandSlug: string, productSlug: string): string | null {
  return PRODUCT_IMAGES[`${brandSlug}/${productSlug}`] ?? null;
}
