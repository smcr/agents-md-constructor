## Why

There is no application yet: the repository only contains the product brief in `AGENTS.md`. Teams need a constructor that stores reusable Sections, Rules, and Tags and assembles an `AGENTS.md` file from approved, user-selected rules instead of writing it by hand.

## What Changes

- Greenfield backend (Node.js + PostgreSQL) with CRUD for `Section`, `Rule`, and `Tag`.
- APIs to attach/detach Tags on Sections and Rules, and to search Rules by Tag and Section.
- Greenfield Vue frontend with two top-level pages: **Справочники** (entity CRUD) and **Конструктор** (select approved rules and preview generated markdown).
- Constructor preview: a floating **Показать** button opens a popup whose textarea contains the assembled `AGENTS.md` text.
- Local development via Docker Compose; a Makefile for all common developer commands; a single production image that serves frontend and backend together, plus Kubernetes manifests for prod.

Assumptions recorded from the brief (typos and gaps):

- `Teg` in the brief means `Tag`.
- Field `apvoved` is stored and exposed as `approved`.
- Checkbox selections persist across Section switches for the whole session (in-memory; not persisted to the database).
- Preview includes **all** selected rules across **all** sections (grouped by section), not only the currently selected Section. Section `description` is included for every Section that has at least one selected Rule. This is the only interpretation that makes a constructor useful given persistent checkboxes.
- `counter` is a stored integer (default `0`) on Section and Rule, editable via CRUD; no automatic increment in this change.
- No authentication in this change.

## Capabilities

### New Capabilities

- `catalog`: CRUD for Section, Rule, and Tag; tag attach/detach for both Section and Rule; search Rules by Tag and/or Section; Справочники UI with left-nav entity switcher.
- `constructor`: approved-only Section/Rule browsing, persistent rule checkboxes, floating Показать action, popup textarea with assembled `AGENTS.md` preview.
- `platform`: Docker Compose for local dev, Makefile targets, single production image (frontend + backend), Kubernetes deployment.

### Modified Capabilities

- None. `openspec/specs/` is empty; this is a greenfield project.

## Impact

- New repository layout: `backend/`, `frontend/`, `docker-compose.yml`, `Makefile`, `Dockerfile` (prod), `k8s/`.
- New HTTP JSON API consumed by the Vue SPA.
- New PostgreSQL schema (`section`, `rule`, `tag`, `tag_rule`, `tag_section`).
- Local stack runs via Docker Compose; prod ships as one container behind Kubernetes.
- No existing application code, APIs, or specs are modified.
