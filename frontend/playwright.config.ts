import { defineConfig, devices } from "@playwright/test";

const channel = process.env.PW_CHANNEL;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: channel
        ? { ...devices["Desktop Chrome"], channel: "chrome" }
        : { ...devices["Desktop Chrome"] },
    },
  ],
});
