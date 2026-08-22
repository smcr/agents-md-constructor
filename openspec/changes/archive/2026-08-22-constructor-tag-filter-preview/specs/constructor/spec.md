## ADDED Requirements

### Requirement: Constructor Tag filter
The Конструктор page SHALL show, at the top of the main (right) pane, a multi-select list of Tags whose `approved` is true. Unapproved Tags MUST NOT appear. The user MAY select zero, one, or several Tags. Selecting Tags MUST NOT write to the database.

When no Tags are selected, the constructor MUST show every approved Section and, for the selected Section, every approved Rule (subject to the existing approved-only rules).

When one or more Tags are selected, a Section is visible only if it is approved **and** is associated with **every** selected Tag (AND). A hidden Section MUST hide all of its Rules, even if some of those Rules are associated with the selected Tags. Among Rules of a still-visible Section, a Rule is visible only if it is approved **and** is associated with **every** selected Tag. Constructor MUST still never list a Section or Rule whose `approved` is false.

If the currently selected Section becomes hidden by the Tag filter, the constructor MUST clear that selection and, if any visible Sections remain, select the first remaining one in left-pane order. Checkbox selections for Rules that become hidden MUST be kept in session memory.

#### Scenario: Show only approved Tags
- **WHEN** the user opens Конструктор and some Tags have `approved` false
- **THEN** the Tag list at the top of the main pane includes only Tags with `approved` true

#### Scenario: No Tags selected shows all approved items
- **WHEN** no Tags are selected
- **THEN** the left pane lists all approved Sections and the right pane lists all approved Rules of the selected Section

#### Scenario: Filter Sections by all selected Tags
- **WHEN** the user selects Tags A and B
- **THEN** the left pane lists only approved Sections associated with both A and B

#### Scenario: Hidden Section hides its Rules even if a Rule has the Tags
- **WHEN** the user selects Tag A and a Section is not associated with A but one of its Rules is
- **THEN** that Section and all of its Rules are hidden

#### Scenario: Filter Rules inside a visible Section
- **WHEN** the user selects Tag A and a Section is associated with A
- **THEN** the right pane lists only that Section's approved Rules that are also associated with A

#### Scenario: Unapproved items stay hidden under a Tag filter
- **WHEN** the user selects a Tag and an unapproved Section or Rule is associated with that Tag
- **THEN** that unapproved Section or Rule is still not listed

#### Scenario: Clear Tag filter
- **WHEN** the user deselects all Tags
- **THEN** all approved Sections and their approved Rules are listed again

## MODIFIED Requirements

### Requirement: Approved Sections in the constructor left pane
On the Конструктор page the left pane SHALL list only Sections whose `approved` is true and that pass the current Tag filter (see Constructor Tag filter). Each Section MUST be rendered as a button whose label is the Section `title`. Unapproved Sections MUST NOT appear.

#### Scenario: List approved Sections
- **WHEN** the user opens Конструктор with no Tags selected and at least one Section has `approved` true
- **THEN** the left pane shows a button for each approved Section titled with that Section's `title`

#### Scenario: Hide unapproved Sections
- **WHEN** a Section has `approved` false
- **THEN** that Section is not listed in the constructor left pane

### Requirement: Approved Rules in the constructor right pane
When the user selects a Section, the right pane SHALL list only Rules that belong to that Section, whose `approved` is true, and that pass the current Tag filter (see Constructor Tag filter). Each Rule MUST be shown with a checkbox. Unapproved Rules MUST NOT appear.

#### Scenario: Show approved Rules for the selected Section
- **WHEN** the user selects an approved Section that has approved Rules and no Tags are selected
- **THEN** the right pane lists those approved Rules each with a checkbox

#### Scenario: Hide unapproved Rules
- **WHEN** a Rule belonging to the selected Section has `approved` false
- **THEN** that Rule is not listed in the constructor right pane

#### Scenario: Empty approved Rules
- **WHEN** the selected Section has no approved Rules that pass the current Tag filter
- **THEN** the right pane shows no Rule checkboxes

### Requirement: Preview popup with assembled AGENTS.md
Clicking **Показать** SHALL open a popup that covers 80% of the viewport. The popup MUST contain a textarea occupying 90% of the popup. The textarea MUST contain the assembled preview text built as follows:

1. Consider only Rules that are currently checked (including checked Rules hidden by the Tag filter).
2. For each Section that has at least one checked Rule, include that Section's `description` (omit empty descriptions).
3. Include every checked Rule for that Section, grouped under the Section, using the Rule `rule` text and Rule `description` when present.
4. After that Section's selected Rules, emit a single `Checks:` block that concatenates the non-empty `checks` of those Rules in the same order as the Rules, separated by a blank line. If none of those Rules have non-empty `checks`, the `Checks:` heading and block MUST be omitted for that Section.

Sections in the preview MUST appear in a stable order (the same order as the left-pane Section list when no Tag filter is applied, typically `id` ascending). If no Rules are checked, the textarea MUST be empty.

#### Scenario: Open popup
- **WHEN** the user clicks Показать
- **THEN** a popup covering 80% of the screen opens with a textarea occupying 90% of the popup

#### Scenario: Preview with selections in multiple Sections
- **WHEN** the user has checked Rules in two approved Sections and clicks Показать
- **THEN** the textarea includes each of those Sections' descriptions and all checked Rules from both Sections, grouped by Section

#### Scenario: Skip Sections with no checked Rules
- **WHEN** an approved Section is listed but has no checked Rules
- **THEN** that Section's description is not included in the textarea

#### Scenario: No selections
- **WHEN** the user clicks Показать with no Rules checked
- **THEN** the textarea is empty

#### Scenario: One Checks block per Section
- **WHEN** the user has checked two Rules in the same Section, both with non-empty `checks`, and clicks Показать
- **THEN** that Section's preview contains exactly one `Checks:` heading whose body includes both Rules' `checks` text

#### Scenario: Omit Checks heading when empty
- **WHEN** the user has checked Rules in a Section and none of those Rules have non-empty `checks`
- **THEN** that Section's preview does not contain the text `Checks:`
