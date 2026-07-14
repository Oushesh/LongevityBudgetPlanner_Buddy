## LongevityBudgetPlanner_Buddy

Longevity budget planning agent focused on helping people allocate money toward
high-value health and longevity interventions.

## Project Layout

- `django/`: Django + Django REST Framework backend using `uv` and `pyproject.toml`.
- `frontend/`: Next.js demo UI (auth, budget form, catalog table, plan, coach).
- `django_hardware_compliance/`: Hardware compliance API (port **8001**) — Fuchsia-style workflow.
- `frontend_hardware_compliance/`: Compliance UI (port **3001**) — standards, docs, labs, timeline.
- `django_supplements_buddy/`: COA / TrustScore API for supplement & olive-oil brand reviews (port **8001**).
- `frontend_supplements_buddy/`: **Labdoor-style** review UI — TrustScore, key data table, buying options (port **3000**).
- `rust/`: reserved folder for future performance-critical planning components.

## Hardware compliance MVP

See [django_hardware_compliance/README.md](django_hardware_compliance/README.md) and [frontend_hardware_compliance/README.md](frontend_hardware_compliance/README.md).

```bash
cd django_hardware_compliance && uv sync && uv run python manage.py migrate
uv run python manage.py seed_standards && uv run python manage.py seed_requirements
uv run python manage.py seed_labs && uv run python manage.py seed_demo_project
uv run python manage.py runserver 8001

cd frontend_hardware_compliance && pnpm install && pnpm dev
```

Demo user: `demo` / `demo-password-change-me`

## Supplements Buddy — Labdoor-style reviews

TrustScore + COA breakdown UI (like [Labdoor](https://labdoor.com/)) for supplements and olive oil. Full details: [frontend_supplements_buddy/README.md](frontend_supplements_buddy/README.md) and [django_supplements_buddy/README.md](django_supplements_buddy/README.md).

### Fastest way to see the page (no API)

```bash
corepack enable   # one-time
cd frontend_supplements_buddy
cp .env.example .env.local
pnpm install
pnpm dev
```

Open these in your browser:

| What | URL |
|------|-----|
| **Labdoor-style demo** (static Omapure review) | [http://localhost:3000/review/demo/omapure-omega-3-fish-oil](http://localhost:3000/review/demo/omapure-omega-3-fish-oil) |
| Home + search | [http://localhost:3000](http://localhost:3000) |
| **Compare 2 products side by side** (omega-6 demo) | [http://localhost:3000/compare/side-by-side](http://localhost:3000/compare/side-by-side) |
| Compare chart (olive oil) | [http://localhost:3000/compare](http://localhost:3000/compare) |

The demo review shows **TrustScore**, **Key Data** (Found / Claimed / Limit), **Certifications**, category score bars, and **Buying Options** — same layout pattern as Labdoor product pages.

### Compare two omega-6 supplements side by side

Works **without the API** using demo COA data:

| Product | TrustScore |
|---------|------------|
| Sunday Naturals Omega-6 GLA | 84.2 / 100 |
| NutraVita Evening Primrose Omega-6 | 78.8 / 100 |

**One-click demo:** [Sunday Naturals vs NutraVita](http://localhost:3000/compare/side-by-side?a=demo/demo/sunday-naturals-omega-6&b=demo/demo/nutravita-evening-primrose-omega-6)

**Steps:**

1. Run `pnpm dev` in `frontend_supplements_buddy`.
2. Open **Compare** in the header → `/compare/side-by-side`.
3. Search **Sunday Naturals** in Product A and **NutraVita** in Product B.
4. Click **Compare side by side** — TrustScores and key data appear in two columns plus a shared analyte table.

More detail: [frontend_supplements_buddy/README.md](frontend_supplements_buddy/README.md#compare-2-products-side-by-side-omega-6).

### Full stack (live olive-oil data from API)

```bash
# Terminal 1 — API on :8001
cd django_supplements_buddy
cp .env.example .env
docker compose up -d          # Postgres, or set DATABASE_URL in .env
uv sync
uv run python manage.py migrate
uv run python manage.py seed_olive_oil
uv run python manage.py runserver 8001

# Terminal 2 — UI on :3000
cd frontend_supplements_buddy
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
pnpm install
pnpm dev
```

Example live review URLs:

- [http://localhost:3000/review/olvlimits/extra-virgin-polyphenol-rich](http://localhost:3000/review/olvlimits/extra-virgin-polyphenol-rich)
- [http://localhost:3000/review/getsoloio/daily-dose-evoo](http://localhost:3000/review/getsoloio/daily-dose-evoo)
- [http://localhost:3000/review/blueprint/extra-virgin-olive-oil](http://localhost:3000/review/blueprint/extra-virgin-olive-oil)

### Frontend E2E tests (Playwright)

Smoke tests start the dev server automatically. **Demo tests do not need Django.**

```bash
cd frontend_supplements_buddy
pnpm install
pnpm exec playwright install chromium   # first time only
pnpm test:e2e
```

| Test file | What it checks |
|-----------|----------------|
| `e2e/review-demo.spec.ts` | Omapure demo page — TrustScore 96.6, KEY DATA, BUYING OPTIONS |
| `e2e/side-by-side-compare.spec.ts` | Omega-6 side-by-side demo (Sunday Naturals vs NutraVita, no API) |
| `e2e/api-integration.spec.ts` | Olive-oil reviews + compare (skipped if API on `:8001` is down) |

Run **all** tests (including API integration):

```bash
# terminal 1
cd django_supplements_buddy && uv run python manage.py runserver 8001

# terminal 2
cd frontend_supplements_buddy && pnpm test:e2e
```

Interactive debug UI: `pnpm test:e2e:ui`

Backend API tests only:

```bash
cd django_supplements_buddy
uv run python manage.py test coa.tests.test_api -v 2
```

## How the budget planner works (user journey)

1. **Sign up / sign in** — JWT access token is used for all planner and coach calls.
2. **Profile & budget** — You save age, region, insurance type (GKV/PKV), income, fixed costs, optional monthly “longevity” cap, and **goals** (sleep, diagnostics, supplements, etc.).
3. **Catalog (optional)** — `GET /planner/interventions` lists interventions with **trust**, **purity**, **bioavailability**, and formulation **quality** scores (0–10). The engine ranks options by weighted scores divided by monthly cost.
4. **Generate plan** — You pick a scenario (`conservative` / `balanced` / `aggressive`). The API allocates your longevity budget into concrete line items with rationales and embedded intervention scores.
5. **Coach** — `POST /coach/recommend` returns grounded next steps from your plan (swap in a full chatbot/LLM later).

Automated API journey tests live in `django/tests/test_budget_planner_journey.py`; ranking logic tests in `django/planner/tests/test_scoring.py`.

## Frontend (Next.js)

The frontend uses [pnpm](https://pnpm.io) (pinned to `pnpm@11` via the `packageManager` field). Enable Corepack once so the right version is shimmed automatically:

```bash
corepack enable   # one-time
cd frontend
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Run Django on port 8000 with CORS allowing `http://localhost:3000` (see `django/.env.example`).

### Interactive Mobile Mockups Demo

The frontend contains interactive, pixel-perfect reconstructions of mobile mockup designs from the `FEATURES/` folder:
* **Location Analysis ([`/analyse`](frontend/app/analyse/page.tsx))**: Santa Monica quality monitoring dashboard (`AppReview001.webp`).
* **Top Rated Catalog ([`/water`](frontend/app/water/page.tsx))**: Sage-green category grid (`AppOasis002.webp` / `AppOasis004.webp`) with custom SVG illustrations.
* **Health Score Profile ([`/profile`](frontend/app/profile/page.tsx))**: Health score circular progress gauge and active products list (`AppOasis003.webp`).
* **System Alerts ([`/alerts`](frontend/app/alerts/page.tsx))**: Contextual warnings for contaminants.

For usage guidelines, see [frontend/README.md](frontend/README.md#interactive-mobile-mockups-demo).

## MVP Features (Implemented)

- User/profile input capture with Germany-focused insurance support (`GKV` / `PKV`).
- Deterministic planner engine that generates scenario-based monthly longevity budgets:
  - `conservative`
  - `balanced`
  - `aggressive`
- Budget line-item generation using trust, purity, bioavailability, and formulation quality vs monthly cost.
- Coach recommendation endpoint grounded on generated plan outputs.
- Seed command for default intervention options in Germany.

## Quick Start (Django with uv)

```bash
cd django
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py seed_interventions
uv run python manage.py runserver
```

## API Endpoints

- `POST /auth/register`
- `POST /auth/login` (rate-limited: see `LOGIN_THROTTLE_RATE` in `django/.env.example`)
- `POST /auth/logout` (body: `{"refresh": "<refresh_token>"}` – blacklists the refresh token)
- `POST /auth/token/refresh`
- `GET /auth/me`
- `POST /auth/password/reset` (body: `{"email": "..."}` – sends email with uid/token; same response for unknown emails)
- `POST /auth/password/reset/confirm` (body: `uid`, `token`, `new_password`)
- `GET /planner/interventions`
- `POST /planner/inputs`
- `POST /planner/generate`
- `GET /planner/plans/{id}`
- `POST /planner/plans/{id}/recalculate`
- `POST /coach/recommend`

Planner and coach endpoints require JWT authentication (`Authorization: Bearer <access_token>`).

After `POST /auth/logout`, the **refresh** token is blacklisted and cannot be used again. **Access** tokens remain valid until they expire; use short `ACCESS_TOKEN_LIFETIME` in production if you need faster revocation.

## Example Planner Input

```json
{
  "age": 34,
  "country": "Germany",
  "region": "Berlin",
  "insurance_type": "GKV",
  "risk_preference": "balanced",
  "monthly_income": "4000.00",
  "fixed_costs": "2200.00",
  "discretionary_budget": "900.00",
  "emergency_target": "10000.00",
  "goals": ["sleep", "diagnostics"]
}
```

## Test

```bash
cd django
uv run python manage.py test
```


## End-to-end app connection tests

Use the root `Makefile` to verify frontend and backend integration by running the Playwright login-click smoke test.

### Normal (local machine)

Starts Django on `127.0.0.1:8000`, Next.js on `localhost:3000`, then runs the E2E test:

```bash
make test-local
```

### Docker

Runs backend + frontend + Playwright test in containers through `docker-compose.test.yml`:

```bash
make test-docker
```

Notes:
- `make test-local` expects Django venv dependencies already installed in `django/.venv`.
- `make test-docker` requires Docker with Compose support.



## Extra Feature 01: Product Discovery Features: 
```
   Most of the really good longevity products in Case 1: 
   Extra Virgin Oliv Oil have the least amount of exposure online
   Specially as buyers move more from typical Search Engine like Google Search towards
   a more Agentic AI Search most of the products even provided by Gemini or Claude dont
   appear in the list. So users miss it and companies (the new ones lose visibility, traffic and 
   potentially really good customers)
```

## Extra Feature 02: Longevity Physicians
   Talk to them: Call the Longevity Physicians in Germany.

## Connect the budget planner to the longevity Physician to the other ones. 
   TBD.
   

## Features to develop: 
   <Add frontend features where, we compare the 2 stuffs 2 supplements>


```
   Most of the really good longevity products in Case 1: 
   Extra Virgin Oliv Oil have the least amount of exposure online
   Specially as buyers move more from typical Search Engine like Google Search towards
   a more Agentic AI Search most of the products even provided by Gemini or Claude dont
   appear in the list. So users miss it and companies (the new ones lose visibility, traffic and 
   potentially really good customers)
```

## 