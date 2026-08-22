# auth Specification

## Purpose

Lets editors sign in with a login and password so catalog administration is limited to known users, without public self-registration.

## Requirements

### Requirement: User records
The system SHALL persist Users with fields `id` (generated), `login` (required unique text), `password` (required, stored hashed, never returned by the API), and `name` (required text). There MUST be no public self-registration endpoint. On first setup the system MUST create a default User with login `admin` and password `admin` if no User with that login exists.

#### Scenario: Default admin exists after setup
- **WHEN** the application database is initialized and no `admin` user exists
- **THEN** a User with login `admin` and password `admin` is stored

#### Scenario: Password is not returned
- **WHEN** a client reads a User
- **THEN** the response includes `id`, `login`, and `name` and does not include the password or its hash

### Requirement: Login and logout
The system SHALL authenticate a User by `login` and `password`. A successful login MUST establish a server session. Logout MUST end that session. There MUST be no self-registration.

#### Scenario: Successful login
- **WHEN** a client submits the correct login and password for an existing User
- **THEN** the system establishes a session and returns that User's `id`, `login`, and `name`

#### Scenario: Failed login
- **WHEN** a client submits an unknown login or a wrong password
- **THEN** the system rejects the request and does not establish a session

#### Scenario: Logout
- **WHEN** an authenticated client logs out
- **THEN** the session is ended and subsequent authenticated requests fail until login

### Requirement: Top-menu Войти and Выход
The frontend SHALL show, on the right side of the top menu, a **Войти** button when the visitor is not authenticated. Clicking **Войти** MUST open an authorization popup with login and password fields. When the visitor is authenticated, the top menu MUST show the User's `name` and a **Выход** button instead of **Войти**.

#### Scenario: Guest sees Войти
- **WHEN** the visitor is not authenticated
- **THEN** the top menu shows Войти on the right and does not show Выход

#### Scenario: Open authorization popup
- **WHEN** the visitor clicks Войти
- **THEN** a popup with login and password fields is shown

#### Scenario: Signed-in user sees name and Выход
- **WHEN** the visitor is authenticated
- **THEN** the top menu shows that User's name and Выход, and does not show Войти

#### Scenario: Click Выход
- **WHEN** an authenticated user clicks Выход
- **THEN** the session ends and the top menu shows Войти again
