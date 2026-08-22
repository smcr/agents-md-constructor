## Why

Справочники currently have no access control, so anyone who can open the app can change the catalog. Editors need a login-gated admin area while the constructor stays public.

## What Changes

- Add User entity: `id`, `login`, `password`, `name`. No public self-registration.
- Authenticate with `login` + `password`. Seed a default user `admin` / `admin`.
- Top menu, right side: **Войти** opens an authorization popup. When signed in, show the user's `name` and a **Выход** button instead of **Войти**.
- **Конструктор** remains available to everyone (including guests).
- **Справочники** is available only to authenticated users. Guests who open it are not shown the catalog; they must sign in.
- On the Справочники left menu, add **Users** with CRUD for users in the right pane.

## Capabilities

### New Capabilities

- `auth`: User persistence, login/logout session, default admin user, top-menu Войти/Выход popup.

### Modified Capabilities

- `catalog`: Справочники requires authentication; left menu includes Users CRUD; catalog write APIs require a session.
- `constructor`: top navigation still has Справочники and Конструктор; Справочники is gated; Конструктор stays public.

## Impact

- New `user` table, Prisma migration, password hashing, session cookie, seed of `admin`.
- Backend: login/logout/me APIs, User CRUD, auth middleware on catalog mutations (and User APIs).
- Frontend: top-bar auth UI, route guard for `/catalogs`, Users CRUD page.
- Constructor read APIs and **Показать** (including Rule counter increment) stay usable without login.
