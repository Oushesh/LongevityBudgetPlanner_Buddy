import { expect, test } from "@playwright/test";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001";

async function apiIsUp(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

test.describe("Django API integration", () => {
  test("olvlimits review loads TrustScore from backend", async ({ page }) => {
    test.skip(!(await apiIsUp()), "Django API not running on :8001");

    await page.goto("/review/olvlimits/extra-virgin-polyphenol-rich");

    await expect(
      page.getByRole("heading", { name: /Extra Virgin Polyphenol-Rich/i }),
    ).toBeVisible();
    await expect(page.getByText("TRUSTSCORE").first()).toBeVisible();
    await expect(page.getByText("KEY DATA")).toBeVisible();
    await expect(page.getByText("Total polyphenols")).toBeVisible();
  });

  test("compare page shows three olive oil brands", async ({ page }) => {
    test.skip(!(await apiIsUp()), "Django API not running on :8001");

    await page.goto("/compare");

    await expect(page.getByText("CATEGORY BREAKDOWN")).toBeVisible();
    await expect(page.getByText("Olvlimits")).toBeVisible();
    await expect(page.getByText("GetSoloIO")).toBeVisible();
    await expect(page.getByText("Blueprint")).toBeVisible();
  });
});
