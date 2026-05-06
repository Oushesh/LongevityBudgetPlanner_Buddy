import { expect, test } from "@playwright/test";

test("frontend login click reaches backend", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Username").fill("connection-check-user");
  await page.getByLabel("Password").fill("invalid-password");

  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/auth/login"),
  );
  await page.getByRole("button", { name: "Sign in" }).click();

  const loginResponse = await loginResponsePromise;
  expect([400, 401, 429]).toContain(loginResponse.status());

  // If the backend is down, there is no HTTP response.
  await expect(loginResponse.status()).toBeGreaterThan(0);
});
