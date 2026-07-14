# Longevity Budget Planner (Next.js)



Demo UI for the Django API: register, save profile and budget, browse the intervention catalog (purity / trust / bioavailability), generate a monthly plan, and get coach tips.

---

## 📱 Interactive Mobile Mockups Demo

We have built pixel-perfect React equivalents of the mockup screenshots, wrapped in an interactive phone mockup container. These screens are connected to a shared global React state so that actions in one screen dynamically affect the others.

### Mockup Image vs URL Mapping

| Mockup Screenshot | Next.js Page URL | Description |
| :--- | :--- | :--- |
| [`FEATURES/AppReview001.webp`](../FEATURES/AppReview001.webp) | [`/analyse`](/analyse) | **Location Analysis**: Air/Water Quality scores & pollutant breakdowns for Santa Monica, Munich, and Berlin. |
| [`FEATURES/AppOasis002.webp`](../FEATURES/AppOasis002.webp) | [`/water`](/water) | **Category Catalog**: 2-column category grid featuring custom high-fidelity SVG illustrations and product drawers. |
| [`FEATURES/AppOasis003.webp`](../FEATURES/AppOasis003.webp) | [`/profile`](/profile) | **Health Profile**: Health score circular gauge, toxin counters, and logged products list. |
| *Mockup Alert State* | [`/alerts`](/alerts) | **System Alerts**: Displays context-specific warnings when parameters in a location exceed safe limits. |

### 📘 Interactive User Manual

1. **Changing Locations (`/analyse`)**:
   * Click on the city title (e.g. **Santa Monica, CA**) at the top to toggle between Santa Monica, Munich, and Berlin. Note how the Air Quality and Water Quality indices automatically adapt.
   * Tap on either the **Air Quality** or **Water Quality** summary cards to instantly filter the detailed contaminant list below.
2. **Adding Products to Profile (`/water`)**:
   * Scroll through the category list, containing custom-coded SVGs matching the original mock designs.
   * Tap on any category card (e.g. **Bottled water**, **Water filters**) to slide up the product drawer.
   * Tap the `+` icon on any product to add it to your profile. A blue quantity badge will appear on the category card.
3. **Tracking Health Progress (`/profile`)**:
   * Visit the Profile page to inspect your overall **Health score** progress ring, computed dynamically as the average purity of your active logged products.
   * Aggregated metrics for **Toxins**, **Benefits**, and **Risks** update in real-time.
   * Hover over any product in the **My products** list to reveal a trash icon to remove it.
   * Tap the **settings gear** in the top-right corner to open a settings drawer panel to adjust alerts and toggle dark mode simulation.
4. **Monitoring Alerts (`/alerts`)**:
   * Review critical notifications regarding lead levels or high particulate counts.
   * Tap any alert to mark it as read and dismiss it.


## Setup

This project uses [pnpm](https://pnpm.io) (pinned via the `packageManager` field in `package.json`). The easiest way to use the right version is via Corepack, which ships with Node.js 22+:

```bash
corepack enable   # one-time, picks up pnpm@11 from package.json
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Point `NEXT_PUBLIC_API_URL` at your Django server (default `http://127.0.0.1:8000`).

## Backend

From the repo root, in another terminal:

```bash
cd ../django
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py seed_interventions
uv run python manage.py runserver
```

Ensure `CORS_ALLOWED_ORIGINS` in Django includes `http://localhost:3000` and `http://127.0.0.1:3000` (see `django/.env.example`).

## Connection smoke test (frontend click -> backend response)

This test opens the login page, clicks **Sign in**, and verifies a handled login error comes back from the API. If the backend is down, this test fails.

Prerequisites:
- Django API running at `http://127.0.0.1:8000`
- Next.js frontend running at `http://127.0.0.1:3000`

Run:

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test:e2e
```
