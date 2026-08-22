## ADDED Requirements

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
