import { expect, test } from "@playwright/test";

test("sleep assessment typeform flow", async ({ page }) => {
  await page.goto("/assessment/sleep");

  await expect(
    page.getByRole("heading", { name: /Comprehensive Sleep & Circadian Assessment/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start" }).click();

  await page.locator('input[type="time"]').first().fill("23:00");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator('input[type="number"]').fill("15");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator('input[type="time"]').fill("07:30");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "3", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByRole("button", { name: "10:00 AM – 12:00 PM" })
    .click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByRole("button", { name: "30 to 60 minutes after waking" })
    .click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "4", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Rarely or never" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Under 30 minutes" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Before 12:00 PM" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByRole("button", { name: "Yes — 30+ minutes most days" })
    .click();
  await page.getByRole("button", { name: "See results" }).click();

  await expect(page).toHaveURL(/\/assessment\/sleep\/results$/);
  await expect(page.getByRole("heading", { name: "Your circadian profile" })).toBeVisible();
  await expect(page.getByText(/chronotype/i)).toBeVisible();
});
