## 1. Data and seed

- [x] 1.1 Add Prisma `User` model (`login` unique, `password_hash`, `name`) and a migration
- [x] 1.2 Seed default user `admin` / `admin` if missing and run seed from `make migrate`

## 2. Auth API

- [x] 2.1 Add session middleware, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- [x] 2.2 Add authenticated User CRUD at `/api/users` (no password in responses)
- [x] 2.3 Require auth on catalog writes; keep constructor GETs and Rule counter increment public

## 3. Frontend

- [x] 3.1 Add auth client (`credentials: "include"`) and session state loaded on app start
- [x] 3.2 Top menu: **Войти** popup for guests; name + **Выход** when signed in
- [x] 3.3 Guard `/catalogs`: guests do not see CRUD and are shown the login popup; Конструктор stays public
- [x] 3.4 Add **Users** to the Справочники left menu and a User CRUD workspace
