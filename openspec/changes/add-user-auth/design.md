## Context

The SPA and Express API currently have no users or sessions. Constructor and catalog share the same origin (Vite proxy locally; one process in prod). See `proposal.md` for motivation and `specs/` for behavior.

## Goals / Non-Goals

**Goals:**

- Cookie session after login so the Vite proxy and the production single-origin image both send credentials automatically.
- Hash passwords; never persist or return plaintext.
- Keep constructor reads and Rule counter increment public.

**Non-Goals:**

- Roles, OAuth, email, password reset, CSRF tokens beyond SameSite cookies.
- Public registration.
- Hiding the Справочники link from guests (the click opens Войти).

## Decisions

### 1. `user` table + bcrypt

Prisma model `User` mapped to `user`: `id` serial, `login` unique text, `password_hash` text, `name` text. API field `password` is write-only. Hash with bcrypt (cost 10). JSON responses: `{ id, login, name }` only.

**Alternatives considered:** Store `password` plaintext — rejected. Separate `password` column name in DB — `password_hash` makes the hashing contract obvious.

### 2. Session cookie, not JWT in localStorage

`express-session` (or a signed `httpOnly` cookie with user id) with `SESSION_SECRET`. Cookie: `httpOnly`, `sameSite=lax`, `path=/`. Login `POST /api/auth/login` `{ login, password }` sets the session. `POST /api/auth/logout` destroys it. `GET /api/auth/me` returns the current user or 401.

Vite proxy must forward `Cookie` / `Set-Cookie`. Frontend `fetch` uses `credentials: "include"`.

**Alternatives considered:** JWT in localStorage — XSS can steal it; extra header wiring. Memory-only frontend flag — lost on refresh.

### 3. Which routes are public

Public: `GET /api/health`, `GET /api/auth/me`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/sections`, `GET /api/sections/:id`, `GET /api/rules`, `GET /api/rules/:id`, `GET /api/tags`, `GET /api/tags/:id`, `POST /api/rules/:id/counter`.

Authenticated: User CRUD `/api/users`, and every catalog POST/PATCH/PUT/DELETE except Rule counter increment.

Middleware: `requireAuth` on those routers.

### 4. Seed `admin` / `admin`

`prisma/seed.ts` creates login `admin`, name `Admin`, password `admin` if missing. `make migrate` runs `prisma migrate deploy` then `prisma db seed`. Document default credentials in README.

### 5. Frontend

Module-level auth state (`currentUser`, `loadMe` on app start). Top bar in `App.vue`: right-aligned **Войти** / name + **Выход**. Popup: login, password, submit.

Router `beforeEach`: `/catalogs` requires `currentUser`; if missing, stay on constructor (or redirect `/constructor`) and open the login popup. After successful login, if the user had clicked Справочники, navigate to `/catalogs`.

`/catalogs/users` → `UsersCrud.vue` (list/create/edit/delete). Password required on create; optional on edit.

Cannot delete the currently signed-in user (avoids lockout). Any authenticated user may manage Users (no roles).

## Risks / Trade-offs

- [Default `admin`/`admin` is a known password] → Change after first login in Users CRUD; document in README.
- [SESSION_SECRET missing] → Require it in production; generate a default only in local Compose.
- [Guest can still increment Rule counters] → Required so **Показать** stays public.

## Migration Plan

Add Prisma migration + seed. Deploy backend then frontend. Rollback: drop `user` table and remove auth middleware (catalog becomes public again).

## Open Questions

None.
