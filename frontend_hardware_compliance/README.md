# Hardware Compliance Frontend

Next.js demo UI for the hardware compliance API ([Fuchsia](https://getfuchsia.ai/)-style workflow).

## Quick start

```bash
cd frontend_hardware_compliance
cp .env.local.example .env.local
corepack enable   # one-time
pnpm install
pnpm dev          # http://localhost:3001
```

Start the API on port **8001** first — see [django_hardware_compliance](../django_hardware_compliance/README.md).

## Pages

- `/` — marketing landing, standards table, workflow steps
- `/register`, `/login` — JWT auth
- `/dashboard` — project list
- `/projects/new` — product wizard
- `/projects/[id]` — workspace (requirements, docs, labs, timeline)

**Demo login** (after `seed_demo_project`): `demo` / `demo-password-change-me`

## E2E

With API on 8001 and frontend on 3001:

```bash
pnpm test:e2e
```
