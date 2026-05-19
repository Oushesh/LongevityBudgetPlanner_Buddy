SHELL := /bin/bash

.PHONY: help test-local test-docker compliance-dev compliance-test

help:
	@echo "Available targets:"
	@echo "  make test-local        # Run budget planner frontend<->backend E2E"
	@echo "  make test-docker       # Run budget planner E2E in Docker Compose"
	@echo "  make compliance-dev    # Run hardware compliance API (8001) + UI (3001)"
	@echo "  make compliance-test   # Run hardware compliance Django tests"

compliance-dev:
	@set -euo pipefail; \
	ROOT="$$(pwd)"; \
	trap 'kill $$BACK_PID $$FRONT_PID >/dev/null 2>&1 || true' EXIT; \
	cd "$$ROOT/django_hardware_compliance"; \
	uv run python manage.py runserver 127.0.0.1:8001 > /tmp/hcc_backend.log 2>&1 & \
	BACK_PID=$$!; \
	cd "$$ROOT/frontend_hardware_compliance"; \
	pnpm dev > /tmp/hcc_frontend.log 2>&1 & \
	FRONT_PID=$$!; \
	echo "API: http://127.0.0.1:8001  UI: http://localhost:3001"; \
	wait $$BACK_PID $$FRONT_PID

compliance-test:
	cd django_hardware_compliance && uv run python manage.py test compliance

test-local:
	@set -euo pipefail; \
	ROOT="$$(pwd)"; \
	COREPACK_HOME="$$ROOT/.corepack"; \
	trap 'kill $$BACK_PID $$FRONT_PID >/dev/null 2>&1 || true' EXIT; \
	cd "$$ROOT/django"; \
	.venv/bin/python manage.py runserver 127.0.0.1:8000 > /tmp/lbp_backend.log 2>&1 & \
	BACK_PID=$$!; \
	cd "$$ROOT/frontend"; \
	COREPACK_HOME="$$COREPACK_HOME" pnpm dev > /tmp/lbp_frontend.log 2>&1 & \
	FRONT_PID=$$!; \
	for PORT in 8000 3000; do \
		SECONDS_WAIT=0; \
		while ! python3 -c "import socket; s=socket.socket(); s.settimeout(0.5); s.connect(('127.0.0.1', $$PORT)); s.close()"; do \
			sleep 0.5; \
			SECONDS_WAIT=$$((SECONDS_WAIT + 1)); \
			if [ $$SECONDS_WAIT -gt 120 ]; then \
				echo "Timeout waiting for localhost:$$PORT"; \
				exit 1; \
			fi; \
		done; \
	done; \
	cd "$$ROOT/frontend"; \
	E2E_BASE_URL="http://localhost:3000" PW_CHANNEL=chrome COREPACK_HOME="$$COREPACK_HOME" pnpm test:e2e

test-docker:
	@set -euo pipefail; \
	docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from e2e --renew-anon-volumes; \
	CODE=$$?; \
	docker compose -f docker-compose.test.yml down -v --remove-orphans; \
	exit $$CODE
