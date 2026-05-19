# Hardware Compliance API

Django + DRF backend for the Fuchsia-style hardware compliance workflow (standards mapping, documentation drafts, lab matching, timeline).

## Quick start

```bash
cd django_hardware_compliance
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py seed_standards
uv run python manage.py seed_requirements
uv run python manage.py seed_labs
uv run python manage.py seed_demo_project   # optional demo user: demo / demo-password-change-me
uv run python manage.py runserver 8001
```

Set `OPENAI_API_KEY` in `.env` for LLM-powered analysis and doc drafts. Without it, rule-based mapping and templates are used.

## API

- `GET /health` — public
- `GET /compliance/standards` — public catalog
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/POST /compliance/projects`
- `POST /compliance/projects/{id}/analyze`
- `GET /compliance/projects/{id}/requirements`
- `POST /compliance/projects/{id}/draft-docs`
- `POST /compliance/projects/{id}/match-labs`
- `GET /compliance/projects/{id}/tasks`

Frontend: [frontend_hardware_compliance](../frontend_hardware_compliance) on port **3001**.

**Disclaimer:** Demo data and AI drafts are not legal or regulatory advice.

## Tests

```bash
uv run python manage.py test
```
