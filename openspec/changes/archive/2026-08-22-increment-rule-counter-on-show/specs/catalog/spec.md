## ADDED Requirements

### Requirement: Atomic increment of Rule counter
The HTTP API SHALL increment a Rule's `counter` by 1 in a single atomic update (the stored value becomes previous value plus one, not a client-supplied absolute number). The response MUST be the updated Rule. If the Rule does not exist, the request MUST be rejected.

#### Scenario: Increment an existing Rule
- **WHEN** a client requests an increment of an existing Rule's `counter` whose current value is N
- **THEN** the system stores N + 1 and returns the Rule with `counter` equal to N + 1

#### Scenario: Increment a missing Rule
- **WHEN** a client requests an increment for a Rule id that does not exist
- **THEN** the system rejects the request and does not change any Rule
