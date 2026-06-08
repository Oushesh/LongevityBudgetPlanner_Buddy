# Supplements Buddy — Frontend

Labdoor-style product review UI built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **pnpm**. Fetches TrustScore and COA key data from `django_supplements_buddy`.

## Quick start

```bash
# Terminal 1 — Django API
cd django_supplements_buddy
docker compose up -d
uv sync
uv run python manage.py migrate
uv run python manage.py seed_olive_oil
uv run python manage.py runserver 8001

# Terminal 2 — Frontend
cd frontend_supplements_buddy
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Featured reviews + brand search |
| `/review/[brand]/[product]` | Labdoor-style review (score, key data, buying options) |
| `/compare` | Multi-brand TrustScore comparison chart |

### Example review URLs

- `/review/demo/omapure-omega-3-fish-oil` — **Labdoor-style demo** (static data, no API)
- `/review/olvlimits/extra-virgin-polyphenol-rich`
- `/review/getsoloio/daily-dose-evoo`
- `/review/blueprint/extra-virgin-olive-oil`

Product images live in `public/products/*.svg`.

## Labdoor-inspired layout

Each review page includes:

- **TrustScore** — 0–100 with A–F grade scale (like Labdoor Score)
- **Certifications** — lot number, test date, COA availability
- **Key Data** — analyte table (Found / Claimed / Limit)
- **Category scores** — five COA dimensions as progress bars
- **Buying Options** — official site + Amazon search CTA

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # ESLint
```
