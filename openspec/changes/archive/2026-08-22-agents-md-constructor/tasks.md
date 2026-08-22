## 1. Scaffold

- [x] 1.1 Create `backend/` Node 22 TypeScript Express app with Prisma, `tsx` for watch, and `/api/health`
- [x] 1.2 Create `frontend/` Vue 3 + Vite + Vue Router + Pinia app with a top bar (Справочники / Конструктор) and placeholder routes `/catalogs` and `/constructor`
- [x] 1.3 Add `.gitignore`, root `.env.example` with `DATABASE_URL` and `PORT`, and a short README with `make up` / `make migrate` / `make build`

## 2. Database

- [x] 2.1 Add Prisma schema for `section`, `rule`, `tag`, `tag_rule`, `tag_section` with FKs, defaults (`counter=0`, `approved=false`), RESTRICT on `rule.section_id`, CASCADE on join tables
- [x] 2.2 Create the initial Prisma migration and a `make migrate` target that runs it against Compose Postgres

## 3. Catalog API

- [x] 3.1 Implement Section CRUD (`GET/POST /api/sections`, `GET/PATCH/DELETE /api/sections/:id`); reject delete when Rules exist; cascade Tag-Section on successful delete
- [x] 3.2 Implement Rule CRUD (`GET/POST /api/rules`, `GET/PATCH/DELETE /api/rules/:id`); reject create/update when `section_id` is missing; cascade Tag-Rule on delete
- [x] 3.3 Implement Tag CRUD (`GET/POST /api/tags`, `GET/PATCH/DELETE /api/tags/:id`); deleting a Tag removes its join rows
- [x] 3.4 Implement idempotent attach/detach: `PUT/DELETE /api/sections/:id/tags/:tagId` and `PUT/DELETE /api/rules/:id/tags/:tagId`; 404 if either side is missing
- [x] 3.5 Implement Rule search via `GET /api/rules?section_id=&tag_id=` (AND when both present; omitted params ignored); include associated tag ids on list/get payloads

## 4. Справочники UI

- [x] 4.1 Build Справочники layout: left vertical menu (Section / Rule / Tag) switching the right-pane CRUD
- [x] 4.2 Build Section CRUD table/form (title, description, counter, approved) with attach/detach Tags
- [x] 4.3 Build Tag CRUD table/form (title, approved)
- [x] 4.4 Build Rule CRUD table/form requiring a Section, fields description/rule/checks/counter/approved, and attach/detach Tags

## 5. Конструктор UI

- [x] 5.1 Left pane: buttons for Sections with `approved=true` (label = `title`); hide unapproved Sections
- [x] 5.2 Right pane: approved Rules for the selected Section, each with a checkbox; hide unapproved Rules
- [x] 5.3 Pinia store for selected Rule ids that survives Section switches and uncheck, and is not persisted to the API
- [x] 5.4 Floating **Показать** button 50px from the bottom; popup 80% of viewport with textarea at 90% of the popup
- [x] 5.5 Assemble preview text in the browser per design.md (section descriptions + selected rules grouped by section, stable section order; empty textarea when nothing is selected)

## 6. Platform

- [x] 6.1 Add `docker-compose.yml` with `db` (postgres:16), `backend` (watch), and `frontend` (Vite); proxy `/api` from Vite to backend
- [x] 6.2 Add Makefile targets: `up`, `down`, `migrate`, `logs`, `build` (and optional `psql`)
- [x] 6.3 Add multi-stage `Dockerfile`: build Vue, install backend, serve static SPA + `/api` from Express on port 8080; run `prisma migrate deploy` before listen
- [x] 6.4 Add `k8s/deployment.yaml` and `k8s/service.yaml` (ClusterIP 80→8080, `DATABASE_URL` from Secret, placeholder image name)

## 7. Verify

- [x] 7.1 Smoke-test catalog API: CRUD, tag attach/detach idempotency, Rule search by tag and/or section, Section delete blocked when Rules exist
- [x] 7.2 Smoke-test UI: Справочники CRUD, constructor approved-only lists, checkbox persistence across Sections, Показать preview for multi-section selections
- [x] 7.3 Confirm `make up` + `make migrate` brings the stack up and the SPA loads data; confirm `make build` produces a single image that serves SPA and API
