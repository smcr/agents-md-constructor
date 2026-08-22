## MODIFIED Requirements

### Requirement: Top navigation between Справочники and Конструктор
The frontend SHALL show a top menu with two buttons: **Справочники** and **Конструктор**. **Конструктор** MUST be available to everyone, including guests. **Справочники** MUST be available only to authenticated users. Clicking **Конструктор** MUST open the constructor page. Clicking **Справочники** when authenticated MUST open the Справочники page. Clicking **Справочники** when not authenticated MUST NOT show the catalog; the visitor MUST be prompted to sign in (authorization popup).

#### Scenario: Open Конструктор from the top menu
- **WHEN** the user clicks Конструктор
- **THEN** the Конструктор page is shown

#### Scenario: Open Конструктор as a guest
- **WHEN** a guest clicks Конструктор
- **THEN** the Конструктор page is shown without requiring login

#### Scenario: Open Справочники from the top menu
- **WHEN** an authenticated user clicks Справочники
- **THEN** the Справочники page is shown

#### Scenario: Guest clicks Справочники
- **WHEN** a guest clicks Справочники
- **THEN** the Справочники CRUD workspace is not shown and the authorization popup is opened
