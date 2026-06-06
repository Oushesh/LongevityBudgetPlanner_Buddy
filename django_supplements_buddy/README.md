# Supplements Buddy — Django Backend

COA-driven brand comparison API inspired by [SuppCo TrustScore](https://supp.co/trustscore/about/product-trustscore). Users search olive oil brands (e.g. Olvlimits, GetSoloIO, Blueprint) and compare category scores on a 0–10 scale for frontend charts.

## Stack

- Django 6 + Django REST Framework
- PostgreSQL (`psycopg`)
- Pydantic v2 for request/response schemas
- [uv](https://docs.astral.sh/uv/) for dependency management (`pyproject.toml`)

## Quick start

```bash
cd django_supplements_buddy

# Install deps
uv sync

# Copy env and point at your Postgres instance
cp .env.example .env

# Start PostgreSQL (Docker)
docker compose up -d

# Or use an existing Postgres and set DATABASE_URL in .env

uv run python manage.py migrate
uv run python manage.py seed_olive_oil
uv run python manage.py runserver 8001
```

## Tests

Run the API integration tests first — they seed demo data, hit every endpoint, and assert the compare chart payload shape (no Postgres required):

```bash
cd django_supplements_buddy
uv run python manage.py test coa.tests.test_api -v 2
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Service health |
| `GET` | `/api/brands/search/?q=olv` | Autocomplete brand search |
| `GET` | `/api/brands/{slug}/` | Brand + products with TrustScore |
| `GET` | `/api/brands/{brand}/products/{product}/` | Full score breakdown |
| `POST` | `/api/compare/` | Multi-brand comparison chart payload |

### Compare (main frontend endpoint)

```bash
curl -s -X POST http://127.0.0.1:8001/api/compare/ \
  -H "Content-Type: application/json" \
  -d '{"queries": ["olvlimits", "getsoloio", "bryan johnson snake oil"]}' | jq
```

Response includes:

- `products[]` — per-brand TrustScore (0–10) and category breakdown
- `chart` — grouped bar chart data (`categories`, `series`) for SuppCo-style UI
- `not_found` — queries that did not resolve

## TrustScore categories

Mirrors SuppCo's multi-dimensional rating:

1. **Testing & Transparency** — lab tier, public batch COAs
2. **Purity & Contaminants** — heavy metals, pesticides
3. **Potency & Actives** — polyphenols, oleic acid
4. **Label Accuracy** — measured vs claimed (TESTED-style)
5. **Freshness & Quality** — peroxide value, acidity

Scores are computed from `CoaMeasurement` rows on the primary COA per product. Add real COA data via Django admin or importers.

## Frontend integration

Render `chart.categories` on the Y-axis and each `chart.series` as horizontal grouped bars (0–10), plus an overall `trust_score` badge per brand — same pattern as SuppCo's category score breakdown.

```ts
// Example fetch
const res = await fetch("/api/compare/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ queries: selectedBrands }),
});
const { products, chart } = await res.json();
```


## Tests for Supplement Review and Supplement Advise: 

```bash
cd django_supplements_buddy
uv run python manage.py test coa.tests.test_api -v 2
```


## APIs
   According to my survey: Health Research, Journeys and Berberine for Cardiovascular is needed.
   User Stories from my father: 
   Add Andiogram
   Add the Knoblauch supplements --> https://www.sunday.de/schwarzer-knoblauch-extrakt-fermentiert.html?klar_source=google&klar_cpid=19777094632&utm_campaign=DE_NEM_PLA_GE_PerformanceMax_Top&utm_id=727-064-9109_id2:19777094632_id3:&gad_source=1&gad_campaignid=19776347408&gbraid=0AAAAACoe3s9XvQNSrzqcLD7kuLCEaxx1d&gclid=Cj0KCQjwio_RBhDMARIsAJPveNMBoVXSi0F10qnvpbGfclzKc0uUqWAwTumW6W5HohkgDxekgoGaInQaAviDEALw_wcB


  <Berberine as well> 

  User Journey: -> Similar profiles --> similar expected results

  In the future Agent Backed research and approved and also insurance


  
  Tested User stories

   Oliv Oil: user backed research: 

   quantify the pain: How much time do users wait at checkout to finish the purchase?? 

   <Ask this question to the end-user>

   https://www.youtube.com/watch?v=vycKE0OOBnE --> Add link to a tested doctor.

   use case my father
   <Contact the doctor licensed doctor from US>

   https://www.youtube.com/watch?v=vycKE0OOBnE

   User Journey: <get the video from the doctor get it sorted out and fix the problem>

   