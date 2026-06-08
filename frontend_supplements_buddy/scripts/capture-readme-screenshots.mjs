/**
 * Capture README screenshots. Requires dev server on E2E_PORT (default 3000).
 * Usage: pnpm dev &  then  node scripts/capture-readme-screenshots.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "screenshots");
const port = process.env.E2E_PORT ?? "3000";
const base = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(`${base}/`, { waitUntil: "networkidle" });
const featured = page.locator("section").filter({ hasText: "Featured reviews" });
await featured.scrollIntoViewIfNeeded();
await featured.screenshot({
  path: path.join(outDir, "home-featured-reviews.png"),
});

await page.goto(`${base}/review/demo/omapure-omega-3-fish-oil`, {
  waitUntil: "networkidle",
});
await page.screenshot({
  path: path.join(outDir, "review-omapure-demo.png"),
  fullPage: true,
});

await browser.close();
console.log("Screenshots saved to docs/screenshots/");
