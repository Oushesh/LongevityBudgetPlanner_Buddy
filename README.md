## LongevityBudgetPlanner_Buddy

Longevity budget planning agent focused on helping people allocate money toward
high-value health and longevity interventions.

## Project Layout

- `django/`: Django + Django REST Framework backend using `uv` and `pyproject.toml`.
- `rust/`: reserved folder for future performance-critical planning components.

## MVP Features (Implemented)

- User/profile input capture with Germany-focused insurance support (`GKV` / `PKV`).
- Deterministic planner engine that generates scenario-based monthly longevity budgets:
  - `conservative`
  - `balanced`
  - `aggressive`
- Budget line-item generation using quality/trust vs cost ranking.
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
