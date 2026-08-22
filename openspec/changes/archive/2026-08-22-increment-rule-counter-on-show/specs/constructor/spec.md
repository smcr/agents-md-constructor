## ADDED Requirements

### Requirement: Показать increments selected Rule counters
Clicking **Показать** SHALL persist a `counter` increment of 1 for every Rule that is currently checked, including checked Rules hidden by the Tag filter. The increment MUST happen in addition to opening the preview popup. Each click MUST increment once per checked Rule. Unchecked Rules MUST NOT be incremented. `Section.counter` MUST NOT change.

If no Rules are checked, the system MUST NOT change any Rule `counter` values. If some increments fail, the popup MUST still open and the constructor MUST show an error; successful increments MUST remain persisted.

#### Scenario: Increment checked Rules
- **WHEN** the user has checked two Rules and clicks Показать
- **THEN** each of those Rules has `counter` increased by 1 in persistent storage and the preview popup opens

#### Scenario: Hidden checked Rules are incremented
- **WHEN** a checked Rule is hidden by the Tag filter and the user clicks Показать
- **THEN** that Rule's `counter` is still increased by 1

#### Scenario: No selections
- **WHEN** the user clicks Показать with no Rules checked
- **THEN** no Rule `counter` values change

#### Scenario: Repeat click increments again
- **WHEN** the user clicks Показать twice with the same Rules still checked
- **THEN** each of those Rules has `counter` increased by 2 compared to before the first click

#### Scenario: Increment failure still opens preview
- **WHEN** incrementing at least one checked Rule fails and the user clicked Показать
- **THEN** the preview popup still opens and the constructor shows an error
