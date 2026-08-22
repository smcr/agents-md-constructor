## ADDED Requirements

### Requirement: User CRUD
The system SHALL support create, read (list and by id), update, and delete of Users for authenticated clients. Create MUST require `login`, `password`, and `name`. Update MAY change `name`, `login`, and optionally `password` (omit password to leave it unchanged). `login` MUST remain unique. Unauthenticated clients MUST be rejected.

#### Scenario: Create a User while authenticated
- **WHEN** an authenticated client creates a User with login, password, and name
- **THEN** the system stores the User and returns `id`, `login`, and `name`

#### Scenario: List Users while authenticated
- **WHEN** an authenticated client requests the User list
- **THEN** the system returns Users without password hashes

#### Scenario: Unauthenticated User API
- **WHEN** a guest calls a User CRUD endpoint
- **THEN** the system rejects the request

### Requirement: Catalog writes require authentication
Create, update, delete, tag attach/detach, and User CRUD MUST require an authenticated session. Unauthenticated GET of Sections, Rules, and Tags used by the constructor MUST still succeed. Unauthenticated increment of Rule `counter` MUST still succeed.

#### Scenario: Guest cannot create a Section
- **WHEN** a guest POSTs a new Section
- **THEN** the system rejects the request

#### Scenario: Guest can list Rules
- **WHEN** a guest requests the Rule list
- **THEN** the system returns the list

## MODIFIED Requirements

### Requirement: Справочники page
The frontend SHALL provide a top-level **Справочники** page that is available only to authenticated users. While that page is open, a left vertical menu MUST offer buttons `Section`, `Rule`, `Tag`, and `Users`. Selecting a button MUST show a CRUD workspace for that entity in the right pane (list, create, edit, delete). The Rule workspace MUST require choosing a Section. The Section and Rule workspaces MUST allow attaching and detaching Tags. A guest MUST NOT see the Справочники CRUD workspace.

#### Scenario: Open Справочники when authenticated
- **WHEN** an authenticated user opens the Справочники page
- **THEN** the left menu shows Section, Rule, Tag, and Users

#### Scenario: Switch entity in Справочники
- **WHEN** the user clicks Rule in the left menu
- **THEN** the right pane shows Rule CRUD

#### Scenario: Open Users in Справочники
- **WHEN** an authenticated user clicks Users in the left menu
- **THEN** the right pane shows User CRUD

#### Scenario: Manage Tags from Section CRUD
- **WHEN** the user attaches or detaches a Tag on a Section in Справочники
- **THEN** the association is saved and reflected in the UI

#### Scenario: Guest cannot use Справочники
- **WHEN** a guest opens or is sent to the Справочники page
- **THEN** the Справочники CRUD workspace is not shown
