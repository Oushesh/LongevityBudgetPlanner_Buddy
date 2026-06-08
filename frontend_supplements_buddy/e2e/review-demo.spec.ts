import { expect, test } from "@playwright/test";

test.describe("Omapure demo review (no API)", () => {
  test("renders Labdoor-style score, key data, and buying options", async ({
    page,
  }) => {
    await page.goto("/review/demo/omapure-omega-3-fish-oil");

    await expect(
      page.getByRole("heading", { name: "Omapure Omega-3 Fish Oil" }),
    ).toBeVisible();

    await expect(page.getByText("TRUSTSCORE").first()).toBeVisible();
    await expect(page.getByText("96.6")).toBeVisible();
    await expect(page.getByText("of 100")).toBeVisible();

    await expect(page.getByText("KEY DATA")).toBeVisible();
    await expect(page.getByText("Total Omega-3")).toBeVisible();
    await expect(page.getByText("EPA")).toBeVisible();
    await expect(page.getByText("Mercury")).toBeVisible();

    await expect(page.getByText("CERTIFICATIONS")).toBeVisible();
    await expect(page.getByText("C2500263")).toBeVisible();

    await page.getByRole("link", { name: "BUYING OPTIONS" }).click();
    await expect(page.locator("#buy-now")).toBeInViewport();
    await expect(page.getByText("BUY FROM THESE SELLERS")).toBeVisible();
    await expect(page.getByText("Amazon")).toBeVisible();
  });

  test("home page links to demo review", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Supplement reviews backed by lab data" }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /Omapure Omega-3 Fish Oil/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/review\/demo\/omapure-omega-3-fish-oil/);
    await expect(
      page.getByRole("heading", { name: "Omapure Omega-3 Fish Oil" }),
    ).toBeVisible();
  });
});
