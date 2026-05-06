## LongevityBudgetPlanner_Buddy

Longevity budget planning agent focused on helping people allocate money toward
high-value health and longevity interventions.

## Project Layout

- `django/`: Django + Django REST Framework backend using `uv` and `pyproject.toml`.
- `frontend/`: Next.js demo UI (auth, budget form, catalog table, plan, coach).
- `rust/`: reserved folder for future performance-critical planning components.

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

