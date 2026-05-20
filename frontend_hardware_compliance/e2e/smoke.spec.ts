import { expect, test } from "@playwright/test";

test("landing shows standards and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "weeks",
  );
  await expect(page.getByRole("link", { name: "See demo" })).toBeVisible();
});

test("demo page shows workspace and lab matches", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "compliance workspace",
  );
  await expect(page.getByText("Recommended lab match")).toBeVisible();
  await expect(page.getByText("TÜV SÜD Product Service")).toBeVisible();
});

test("register and open dashboard", async ({ page }) => {
  const user = `e2e_${Date.now()}`;
  await page.goto("/register");
  await page.getByLabel("Username").fill(user);
  await page.getByLabel("Email").fill(`${user}@example.com`);
  await page.getByLabel(/Password/).fill("testpass123");
  await page.getByRole("button", { name: /Register/ }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
});
