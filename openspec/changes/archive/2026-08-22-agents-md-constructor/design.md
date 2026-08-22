## Context

Greenfield repository: only `AGENTS.md` and OpenSpec tooling exist. Constraints come from that brief: Node.js + PostgreSQL backend, Vue frontend, Docker Compose for local dev, Kubernetes for prod, one production image for frontend and backend. See `proposal.md` for motivation and `specs/` for behavior.

## Goals / Non-Goals

**Goals:**

- A small, explicit architecture that a developer can run with `make up` and ship as one container.
- REST JSON API that maps 1:1 to the catalog entities and tag join tables.
- Vue SPA that keeps constructor checkbox state in client memory and assembles preview text locally (no preview API).

**Non-Goals:**

- Authentication, authorization, multi-tenancy.
- Persisting constructor selections or generated files on the server.
- Pagination, full-text search, or audit history.
- Running PostgreSQL inside Kubernetes as part of this change (Postgres is an external dependency).

## Decisions

### 1. TypeScript Express API + Prisma + Vue 3 (Vite)

- **Backend**: Node.js 22, TypeScript, Express. Express is enough for CRUD and is easy to serve static files from in production.
- **DB access**: Prisma. Gives a migration workflow (`make migrate`) and typed queries without a large ORM surface.
- **Frontend**: Vue 3 + Vue Router + Pinia + Vite. Pinia holds constructor selections as `Set<ruleId>` (or `Record<sectionId, number[]>`).
- **Alternatives considered**: NestJS (more ceremony than this CRUD app needs); Fastify (fine, but Express static-file serving for the SPA is simpler); Drizzle/Knex (more SQL control, more boilerplate for migrations).

### 2. Repository layout

```
backend/          Express + Prisma
frontend/         Vue 3 SPA
docker-compose.yml
Dockerfile        multi-stage prod image
Makefile
k8s/              Deployment + Service + ConfigMap example
```

API prefix: `/api`. JSON field names match the ER diagram in snake_case (`section_id`, `approved`) so the UI and DB stay aligned. `approved` is the stored name for the brief's `apvoved`.

### 3. Data model

PostgreSQL tables:

| Table | Columns |
| --- | --- |
| `section` | `id` PK serial, `title` text not null, `description` text null, `counter` int not null default 0, `approved` bool not null default false |
| `rule` | `id` PK serial, `section_id` FK → section not null, `description` text null, `rule` text not null, `checks` text not null, `counter` int not null default 0, `approved` bool not null default false |
| `tag` | `id` PK serial, `title` text not null, `approved` bool not null default false |
| `tag_rule` | `tag_id` + `rule_id` composite PK |
| `tag_section` | `tag_id` + `section_id` composite PK |

ON DELETE: `rule.section_id` RESTRICT (enforces “cannot delete Section with Rules”). Join rows CASCADE when Tag, Rule, or Section is deleted. Unique `(tag_id, section_id)` / `(tag_id, rule_id)` makes attach idempotent.

### 4. HTTP API

Standard REST, JSON, errors as `{ "error": "..." }` with 4xx/5xx.

| Method | Path | Purpose |
| --- | --- | --- |
| GET/POST | `/api/sections` | list / create |
| GET/PATCH/DELETE | `/api/sections/:id` | read / update / delete |
| PUT/DELETE | `/api/sections/:id/tags/:tagId` | attach / detach Tag |
| GET/POST | `/api/rules` | list / create (`GET` accepts `section_id`, `tag_id` query params for search) |
| GET/PATCH/DELETE | `/api/rules/:id` | read / update / delete |
| PUT/DELETE | `/api/rules/:id/tags/:tagId` | attach / detach Tag |
| GET/POST | `/api/tags` | list / create |
| GET/PATCH/DELETE | `/api/tags/:id` | read / update / delete |
| GET | `/api/health` | liveness for Compose/K8s |

Search: `GET /api/rules?section_id=&tag_id=` — omitted params are ignored; both present means AND. List endpoints also return associated tag ids so the CRUD UI can render them without extra round-trips.

Constructor filtering (`approved=true`) is done on the client after loading approved sections (`GET /api/sections` then filter) and `GET /api/rules?section_id=` then filter `approved`. Optional query `approved=true` may be added as a convenience; behavior must still match the spec.

### 5. Frontend structure

- Top bar: **Справочники** → `/catalogs`, **Конструктор** → `/constructor`. Default route: `/constructor`.
- `/catalogs` has a left nav (`Section` / `Rule` / `Tag`) and nested routes for each CRUD table (list + create/edit form, including tag attach/detach on Section and Rule).
- `/constructor`: left list of approved Sections as buttons; right list of approved Rules with checkboxes. Pinia store `selectedRuleIds` is not cleared on Section change.
- Floating **Показать** button: `position: fixed; bottom: 50px`. Popup: overlay 80vw × 80vh (80% of viewport); textarea 90% of popup size. Preview is computed in the browser.

Preview assembly (stable Section order = left-pane order, typically `id` ascending):

```
## {section.title}

{section.description}

{rule.rule}

{rule.description}   # omitted if empty

Checks:
{rule.checks}
```

Blank line between blocks. Sections with zero selected rules are omitted. If nothing is selected, textarea is empty.

### 6. Local Docker Compose

Services: `db` (postgres:16), `backend` (bind-mount + tsx watch), `frontend` (Vite dev server). Frontend proxies `/api` to backend so the browser uses one origin. `DATABASE_URL` points at `db`. Volumes persist Postgres data.

### 7. Production image

Multi-stage `Dockerfile`:

1. Build frontend (`npm ci && npm run build` → `dist/`).
2. Build backend (`npm ci && prisma generate`).
3. Runtime: Node image copies backend + `frontend/dist`. Express serves `/api/*` then `express.static` + SPA fallback. `PORT` default 8080. `DATABASE_URL` required. Run `prisma migrate deploy` on startup (or a Makefile/K8s init command) before listen.

### 8. Makefile (minimum)

- `make up` / `make down` — Compose start/stop
- `make migrate` — Prisma migrate (dev)
- `make logs` — follow Compose logs
- `make build` — `docker build` production image
- `make psql` — optional psql into local db

### 9. Kubernetes

`k8s/deployment.yaml` + `k8s/service.yaml`. Deployment: one replica of the prod image, env `DATABASE_URL` from a Secret (documented example, not committed secrets). Service: ClusterIP port 80 → container 8080. Postgres is assumed already in the cluster or reachable. Image pull is left as a placeholder (`image: agents-md-creator:latest` / `imagePullPolicy: IfNotPresent`).

## Risks / Trade-offs

- [No auth] → Anyone who can reach the app can edit the catalog. Acceptable for an internal first version; put the Service behind cluster network policy / ingress auth later.
- [Client-only selections] → Reload loses checkboxes. Matches the proposal; a later change can persist drafts.
- [Prisma migrate on boot] → Failed migration takes the pod down. Mitigation: health check only after migrate succeeds; keep migrations additive.
- [Single image] → Frontend and backend versions are always shipped together. That is the intended prod model; local Compose still splits them for HMR.

## Migration Plan

1. Land application code, Compose, Makefile, Dockerfile, k8s manifests.
2. Local: `make up` then `make migrate`.
3. Prod: provision PostgreSQL, create Secret with `DATABASE_URL`, build/push image, apply k8s manifests.
4. Rollback: previous image + `prisma migrate` is forward-only; rollback of schema requires a new reverse migration (none expected in v1).

## Open Questions

- Exact wording of Rule labels in the constructor right pane (title vs first line of `rule`) does not change the spec; implementers may show `rule` text truncated with full text in the preview.
- Image registry and Ingress host are environment-specific and left as placeholders in k8s manifests.
