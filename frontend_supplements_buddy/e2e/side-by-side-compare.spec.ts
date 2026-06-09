import { expect, test } from "@playwright/test";

test("omega-6 side-by-side compare (demo, no API)", async ({ page }) => {
  await page.goto(
    "/compare/side-by-side?a=demo/demo/sunday-naturals-omega-6&b=demo/demo/nutravita-evening-primrose-omega-6",
  );

  await expect(
    page.getByRole("heading", { name: "Compare products side by side" }),
  ).toBeVisible();
  await expect(page.getByText("Sunday Naturals Omega-6 GLA")).toBeVisible();
  await expect(
    page.getByText("NutraVita Evening Primrose Omega-6"),
  ).toBeVisible();
  await expect(page.getByText("KEY DATA — SIDE BY SIDE")).toBeVisible();
  await expect(page.getByText("Total Omega-6")).toBeVisible();
});
