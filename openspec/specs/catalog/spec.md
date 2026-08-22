# catalog Specification

## Purpose

Provides CRUD, tagging, and search for Sections, Rules, and Tags, plus a Справочники UI so editors can maintain the catalog that feeds the constructor.

## Requirements

### Requirement: Section CRUD
The system SHALL persist Sections with fields `id` (generated), `title` (required text), `description` (optional text), `counter` (integer, default 0), and `approved` (boolean, default false). The HTTP API MUST support create, read (list and by id), update, and delete of Sections. Delete of a Section MUST fail if the Section still has Rules.

#### Scenario: Create a Section
- **WHEN** a client creates a Section with a title
- **THEN** the system stores the Section and returns it including a generated `id`, `counter` of 0, and `approved` of false unless those fields were provided

#### Scenario: List Sections
- **WHEN** a client requests the Section list
- **THEN** the system returns all Sections

#### Scenario: Update a Section
- **WHEN** a client updates an existing Section's title, description, counter, or approved flag
- **THEN** the system persists the new values and returns the updated Section

#### Scenario: Delete a Section without Rules
- **WHEN** a client deletes a Section that has no Rules
- **THEN** the system removes the Section and any Tag associations for that Section

#### Scenario: Delete a Section that still has Rules
- **WHEN** a client deletes a Section that still has one or more Rules
- **THEN** the system rejects the request and keeps the Section

### Requirement: Rule CRUD
The system SHALL persist Rules with fields `id` (generated), `section_id` (required foreign key to Section), `description` (optional text), `rule` (required text), `checks` (optional text), `counter` (integer, default 0), and `approved` (boolean, default false). The HTTP API MUST support create, read (list and by id), update, and delete of Rules. Creating a Rule MUST fail if the referenced Section does not exist.

#### Scenario: Create a Rule under a Section
- **WHEN** a client creates a Rule with `section_id` and `rule`
- **THEN** the system stores the Rule linked to that Section and returns it including a generated `id`

#### Scenario: Create a Rule without checks
- **WHEN** a client creates a Rule without `checks` or with empty `checks`
- **THEN** the system stores the Rule with `checks` empty/null

#### Scenario: Create a Rule for a missing Section
- **WHEN** a client creates a Rule whose `section_id` does not exist
- **THEN** the system rejects the request

#### Scenario: List Rules
- **WHEN** a client requests the Rule list
- **THEN** the system returns all Rules

#### Scenario: Update a Rule
- **WHEN** a client updates an existing Rule's fields including `section_id`
- **THEN** the system persists the new values provided the target Section exists

#### Scenario: Delete a Rule
- **WHEN** a client deletes a Rule
- **THEN** the system removes the Rule and any Tag associations for that Rule

### Requirement: Atomic increment of Rule counter
The HTTP API SHALL increment a Rule's `counter` by 1 in a single atomic update (the stored value becomes previous value plus one, not a client-supplied absolute number). The response MUST be the updated Rule. If the Rule does not exist, the request MUST be rejected.

#### Scenario: Increment an existing Rule
- **WHEN** a client requests an increment of an existing Rule's `counter` whose current value is N
- **THEN** the system stores N + 1 and returns the Rule with `counter` equal to N + 1

#### Scenario: Increment a missing Rule
- **WHEN** a client requests an increment for a Rule id that does not exist
- **THEN** the system rejects the request and does not change any Rule

### Requirement: Tag CRUD
The system SHALL persist Tags with fields `id` (generated), `title` (required text), and `approved` (boolean, default false). The HTTP API MUST support create, read (list and by id), update, and delete of Tags. Deleting a Tag MUST also remove its associations with Sections and Rules.

#### Scenario: Create a Tag
- **WHEN** a client creates a Tag with a title
- **THEN** the system stores the Tag and returns it including a generated `id`

#### Scenario: List Tags
- **WHEN** a client requests the Tag list
- **THEN** the system returns all Tags

#### Scenario: Update a Tag
- **WHEN** a client updates an existing Tag's title or approved flag
- **THEN** the system persists the new values and returns the updated Tag

#### Scenario: Delete a Tag
- **WHEN** a client deletes a Tag that is attached to Sections or Rules
- **THEN** the system removes the Tag and all of its Tag-Section and Tag-Rule associations

### Requirement: Attach and detach Tags on Sections
The system SHALL allow a client to attach a Tag to a Section and to detach a Tag from a Section. Attaching a Tag that is already attached MUST be idempotent. Attach MUST fail if the Tag or the Section does not exist.

#### Scenario: Attach a Tag to a Section
- **WHEN** a client attaches an existing Tag to an existing Section
- **THEN** the Section is associated with that Tag

#### Scenario: Attach the same Tag twice
- **WHEN** a client attaches a Tag that is already attached to the Section
- **THEN** the system leaves a single association and does not create a duplicate

#### Scenario: Detach a Tag from a Section
- **WHEN** a client detaches a Tag from a Section
- **THEN** the association is removed and both records remain

#### Scenario: Attach a missing Tag or Section
- **WHEN** a client attaches a Tag or Section that does not exist
- **THEN** the system rejects the request

### Requirement: Attach and detach Tags on Rules
The system SHALL allow a client to attach a Tag to a Rule and to detach a Tag from a Rule. Attaching a Tag that is already attached MUST be idempotent. Attach MUST fail if the Tag or the Rule does not exist.

#### Scenario: Attach a Tag to a Rule
- **WHEN** a client attaches an existing Tag to an existing Rule
- **THEN** the Rule is associated with that Tag

#### Scenario: Attach the same Tag twice
- **WHEN** a client attaches a Tag that is already attached to the Rule
- **THEN** the system leaves a single association and does not create a duplicate

#### Scenario: Detach a Tag from a Rule
- **WHEN** a client detaches a Tag from a Rule
- **THEN** the association is removed and both records remain

#### Scenario: Attach a missing Tag or Rule
- **WHEN** a client attaches a Tag or Rule that does not exist
- **THEN** the system rejects the request

### Requirement: Search Rules by Tag and Section
The system SHALL provide an API to search Rules filtered by `section_id`, by `tag_id`, or by both. When both filters are provided, a Rule MUST match only if it belongs to that Section **and** is associated with that Tag. When a filter is omitted, it MUST not constrain the result.

#### Scenario: Search by Section
- **WHEN** a client searches Rules with only `section_id`
- **THEN** the system returns Rules whose `section_id` matches, regardless of Tags

#### Scenario: Search by Tag
- **WHEN** a client searches Rules with only `tag_id`
- **THEN** the system returns Rules associated with that Tag, across Sections

#### Scenario: Search by Tag and Section
- **WHEN** a client searches Rules with both `section_id` and `tag_id`
- **THEN** the system returns only Rules that belong to that Section and are associated with that Tag

#### Scenario: Search with no matches
- **WHEN** a client searches with filters that match no Rules
- **THEN** the system returns an empty list

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

### Requirement: Propose Section and Rule without authentication
The system SHALL accept unauthenticated create of a proposed Section and of a proposed Rule. A proposed Section MUST require `title` and MAY include `description` and `tag_ids`. A proposed Rule MUST require `section_id` and `rule` and MAY include `checks`, `description`, and `tag_ids`. The referenced Section MUST exist. Each `tag_id` MUST refer to an existing Tag; otherwise the request MUST be rejected. The system MUST store both proposals with `approved` false regardless of any `approved` value the client sends and MUST attach the supplied Tags. Other catalog writes (update, delete, later tag attach/detach, User CRUD, and authenticated Section/Rule create that can set `approved`) remain subject to the existing authentication requirement.

#### Scenario: Guest proposes a Section
- **WHEN** a guest submits a Section proposal with a title and optional tag_ids
- **THEN** the system stores a Section with that title, optional description, `approved` false, and the given Tags attached

#### Scenario: Guest cannot approve a proposed Section
- **WHEN** a guest submits a Section proposal with `approved` true
- **THEN** the stored Section still has `approved` false

#### Scenario: Guest proposes a Rule
- **WHEN** a guest submits a Rule proposal with `section_id`, `rule`, and optional tag_ids
- **THEN** the system stores a Rule linked to that Section with optional `checks` and `description`, `approved` false, and the given Tags attached

#### Scenario: Propose with a missing Tag
- **WHEN** a guest submits a proposal whose `tag_ids` include a Tag that does not exist
- **THEN** the system rejects the request

#### Scenario: Propose a Rule for a missing Section
- **WHEN** a guest submits a Rule proposal whose `section_id` does not exist
- **THEN** the system rejects the request

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
