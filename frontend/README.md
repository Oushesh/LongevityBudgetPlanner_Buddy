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
| *Sleep intake* | [`/assessment/sleep`](/assessment/sleep) | **Typeform-style questionnaire**: Circadian & sleep clinical intake (one question per screen). |
| *Results* | [`/assessment/sleep/results`](/assessment/sleep/results) | **Chronotype summary**: Mid-sleep, duration, and key responses after submit. |

### Sleep & Circadian Assessment (`/assessment/sleep`)

Labdoor/Typeform-style clinical intake aligned with the [Google Form questionnaire](https://docs.google.com/forms/d/e/1FAIpQLSdt2CnD5EJjw_t3-as6rLqHiqDWrT9eip9I0Z4myjUqI4mXFQ/viewform). Works **without the Django API** — answers live in `sessionStorage` until retake.

**Quick start:**

```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000/assessment/sleep](http://localhost:3000/assessment/sleep) → complete the wizard → results at `/assessment/sleep/results`.

**Sections (11 questions):**

1. **Circadian Timing & Chronotype** — free-day sleep/wake times, alertness, peak cognitive window, morning hunger (MCTQ & MEQ style)
2. **Sleep Architecture & Quality** — sleep quality rating, night awakenings
3. **Environment & Evening Cues** — screens before bed, caffeine cutoff, morning light

Also reachable from the home page mockup grid (**Sleep & Circadian Assessment** card).

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

## E2E tests (Playwright)

Playwright starts the Next.js dev server automatically (`playwright.config.ts` → `pnpm dev`). Results are **local** unless you upload CI artifacts or share the HTML report.

### First-time setup

```bash
cd frontend
pnpm install
pnpm exec playwright install chromium
```

### Run all tests

```bash
pnpm test:e2e
```

### Run a single spec (fastest smoke check)

```bash
# Sleep questionnaire — no Django API required
pnpm exec playwright test e2e/sleep-assessment.spec.ts

# Login → backend connection — Django must be on :8000
pnpm exec playwright test e2e/backend-connection.spec.ts
```

### What each spec checks

| Spec | API needed? | Verifies |
|------|-------------|----------|
| `e2e/sleep-assessment.spec.ts` | No | Full Typeform flow → `/assessment/sleep/results` with chronotype |
| `e2e/backend-connection.spec.ts` | Yes (`:8000`) | Login page submits and gets a handled API response |

### View results after a run

**Terminal** — pass/fail summary prints inline.

**HTML report** (best for sharing locally):

```bash
pnpm exec playwright show-report
```

Opens an interactive report in the browser (steps, errors, traces on retry).

**Raw artifacts** (on failure):

- `test-results/` — screenshots, traces, error context
- `playwright-report/` — generated report folder (regenerated each run)

These folders are gitignored; teammates only see them if you zip the report, use `--ui` mode in a screen share, or add CI artifact upload.

**Interactive debug mode:**

```bash
pnpm exec playwright test --ui
```

### Connection smoke test (manual prerequisite for API spec)

The backend-connection test opens the login page, clicks **Sign in**, and verifies a handled login error comes back from the API. If Django is down, that spec fails; the sleep assessment spec still passes on its own.

Prerequisites for **all** tests including API:

- Django API at `http://127.0.0.1:8000`
- Frontend at `http://127.0.0.1:3000` (or let Playwright start it)

Legacy one-liner (same as `pnpm test:e2e`):

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test:e2e
```
