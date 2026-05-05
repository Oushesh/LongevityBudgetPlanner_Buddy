# Longevity Budget Planner (Next.js)



Demo UI for the Django API: register, save profile and budget, browse the intervention catalog (purity / trust / bioavailability), generate a monthly plan, and get coach tips.

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
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
