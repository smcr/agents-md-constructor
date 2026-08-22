## MODIFIED Requirements

### Requirement: Approved Rules in the constructor right pane
When the user selects a Section, the right pane SHALL list only Rules that belong to that Section, whose `approved` is true, and that pass the current Tag filter (see Constructor Tag filter). Each Rule MUST be shown with a checkbox and the Rule `rule` text. When a Rule `description` is non-empty after trim, the right pane MUST also show that description under the Rule title, in a smaller and paler style than the title. When the description is empty or whitespace-only, the description MUST be omitted. Unapproved Rules MUST NOT appear.

#### Scenario: Show approved Rules for the selected Section
- **WHEN** the user selects an approved Section that has approved Rules and no Tags are selected
- **THEN** the right pane lists those approved Rules each with a checkbox

#### Scenario: Hide unapproved Rules
- **WHEN** a Rule belonging to the selected Section has `approved` false
- **THEN** that Rule is not listed in the constructor right pane

#### Scenario: Empty approved Rules
- **WHEN** the selected Section has no approved Rules that pass the current Tag filter
- **THEN** the right pane shows no Rule checkboxes

#### Scenario: Show Rule description when filled
- **WHEN** a listed Rule has a non-empty description
- **THEN** that description appears under the Rule title in a smaller, paler style than the title

#### Scenario: Omit empty Rule description
- **WHEN** a listed Rule has an empty or whitespace-only description
- **THEN** no description line is shown for that Rule
