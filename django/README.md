# Django Backend

This backend serves the longevity budget planner and coach APIs.

Run locally:

```bash
cp .env.example .env
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

Authentication endpoints:
- `POST /auth/register`
- `POST /auth/login` (throttled; configure `LOGIN_THROTTLE_RATE` in `.env`)
- `POST /auth/logout` (JSON body: `{"refresh": "..."}`) – token blacklist
- `POST /auth/token/refresh`
- `GET /auth/me`
- `POST /auth/password/reset`, `POST /auth/password/reset/confirm`

Use the returned JWT `access` token as:
`Authorization: Bearer <access_token>`.
