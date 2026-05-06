# Longevity Budget Planner (Next.js)



Demo UI for the Django API: register, save profile and budget, browse the intervention catalog (purity / trust / bioavailability), generate a monthly plan, and get coach tips.

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
