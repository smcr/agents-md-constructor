.PHONY: help up down restart restart-backend restart-frontend migrate logs logs-backend logs-frontend build psql

help:
	@echo "Local stack (Docker Compose)"
	@echo "  make up                 Start db, backend, frontend"
	@echo "  make down               Stop containers (keeps DB volume)"
	@echo "  make restart            Restart backend + frontend (code already on disk)"
	@echo "  make restart-backend    Restart API (tsx / Prisma)"
	@echo "  make restart-frontend   Restart Vite (clears stale HMR)"
	@echo "  make migrate            Apply Prisma migrations"
	@echo "  make logs               Follow all logs"
	@echo "  make logs-backend       Follow API logs"
	@echo "  make logs-frontend      Follow Vite logs"
	@echo "  make psql               Open psql in the db container"
	@echo ""
	@echo "Production image"
	@echo "  make build              Build single image agents-md-creator:latest"

up:
	docker compose up -d

down:
	docker compose down

restart: restart-backend restart-frontend

restart-backend:
	docker compose restart backend

restart-frontend:
	docker compose restart frontend

migrate:
	docker compose up -d db
	docker compose run --rm --no-deps backend sh -c "npm install && npx prisma migrate deploy && npx prisma generate && npx prisma db seed"

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

build:
	docker build -t agents-md-creator:latest .

psql:
	docker compose exec db psql -U agents -d agents
