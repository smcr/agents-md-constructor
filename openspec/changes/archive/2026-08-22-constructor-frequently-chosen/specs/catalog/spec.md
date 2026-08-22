## ADDED Requirements

### Requirement: Query frequently chosen Rules
The system SHALL provide an unauthenticated API that returns frequently-chosen Rules without changing any `counter` values. A Rule is frequently chosen when its `approved` is true, its Section `approved` is true, and its `counter` is strictly greater than the arithmetic mean of `counter` of every Rule whose `approved` is true. The mean MUST be computed from all approved Rules, including those whose Section is not approved. If there are no approved Rules, the result MUST be an empty list.

The client MAY supply zero or more Tag ids. When one or more Tag ids are supplied, a Rule MUST be returned only if it is associated with every supplied Tag **and** its Section is associated with every supplied Tag. When no Tag ids are supplied, Tag associations MUST NOT constrain the result. Unapproved Rules MUST NOT be returned. Rules whose Section is unapproved MUST NOT be returned. The request MUST NOT increment Rule or Section `counter`.

#### Scenario: Return Rules above the approved mean
- **WHEN** a client queries frequently-chosen Rules and approved Rules have counters 1, 1, and 4
- **THEN** the system returns only the Rule whose counter is 4 and does not change any counters

#### Scenario: Exclude Rules equal to the mean
- **WHEN** every approved Rule has the same counter
- **THEN** the system returns an empty list

#### Scenario: Filter by all supplied Tags
- **WHEN** a client queries frequently-chosen Rules with Tag ids A and B
- **THEN** the system returns only frequently-chosen Rules associated with both A and B whose Section is associated with both A and B

#### Scenario: Guest can query
- **WHEN** a guest queries frequently-chosen Rules
- **THEN** the system returns the matching list without requiring login

#### Scenario: Unapproved Rule is omitted from the result
- **WHEN** an unapproved Rule has a counter higher than every approved Rule
- **THEN** that Rule is not in the result and is not used in the mean

#### Scenario: Rule under an unapproved Section is omitted
- **WHEN** an approved Rule under an unapproved Section has a counter above the approved-Rule mean
- **THEN** that Rule is used in the mean but is not in the result
