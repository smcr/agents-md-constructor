## Purpose

Lets editors pick approved Rules across Sections and preview an assembled AGENTS.md document in a popup textarea without writing the file by hand.

## ADDED Requirements

### Requirement: Top navigation between Справочники and Конструктор
The frontend SHALL show a top menu with two buttons: **Справочники** and **Конструктор**. Each button MUST open the corresponding page.

#### Scenario: Open Конструктор from the top menu
- **WHEN** the user clicks Конструктор
- **THEN** the Конструктор page is shown

#### Scenario: Open Справочники from the top menu
- **WHEN** the user clicks Справочники
- **THEN** the Справочники page is shown

### Requirement: Approved Sections in the constructor left pane
On the Конструктор page the left pane SHALL list only Sections whose `approved` is true. Each Section MUST be rendered as a button whose label is the Section `title`. Unapproved Sections MUST NOT appear.

#### Scenario: List approved Sections
- **WHEN** the user opens Конструктор and at least one Section has `approved` true
- **THEN** the left pane shows a button for each approved Section titled with that Section's `title`

#### Scenario: Hide unapproved Sections
- **WHEN** a Section has `approved` false
- **THEN** that Section is not listed in the constructor left pane

### Requirement: Approved Rules in the constructor right pane
When the user selects a Section, the right pane SHALL list only Rules that belong to that Section and whose `approved` is true. Each Rule MUST be shown with a checkbox. Unapproved Rules MUST NOT appear.

#### Scenario: Show approved Rules for the selected Section
- **WHEN** the user selects an approved Section that has approved Rules
- **THEN** the right pane lists those approved Rules each with a checkbox

#### Scenario: Hide unapproved Rules
- **WHEN** a Rule belonging to the selected Section has `approved` false
- **THEN** that Rule is not listed in the constructor right pane

#### Scenario: Empty approved Rules
- **WHEN** the selected Section has no approved Rules
- **THEN** the right pane shows no Rule checkboxes

### Requirement: Persistent Rule checkbox selection
The system SHALL remember which Rule checkboxes the user has checked. Switching to another Section MUST NOT clear selections already made. Returning to a previously selected Section MUST restore that Section's checked state. Selections are session-scoped (lost on full page reload) and MUST NOT be written to the database.

#### Scenario: Keep selections when switching Section
- **WHEN** the user checks Rules in Section A and then selects Section B
- **THEN** the checks made in Section A remain stored

#### Scenario: Restore selections when returning to a Section
- **WHEN** the user returns to Section A after visiting another Section
- **THEN** the previously checked Rules in Section A are still checked

#### Scenario: Uncheck a Rule
- **WHEN** the user unchecks a previously checked Rule
- **THEN** that Rule is no longer treated as selected

### Requirement: Floating Показать button
The Конструктор page SHALL show a floating button labeled **Показать**, positioned 50px from the bottom of the viewport.

#### Scenario: Button is visible on Конструктор
- **WHEN** the user is on the Конструктор page
- **THEN** a floating Показать button is visible 50px from the bottom

### Requirement: Preview popup with assembled AGENTS.md
Clicking **Показать** SHALL open a popup that covers 80% of the viewport. The popup MUST contain a textarea occupying 90% of the popup. The textarea MUST contain the assembled preview text built as follows:

1. Consider only Rules that are currently checked.
2. For each Section that has at least one checked Rule, include that Section's `description` (omit empty descriptions).
3. Include every checked Rule, grouped under its Section, using the Rule `rule` text (and `checks` / Rule `description` when present).

Sections in the preview MUST appear in a stable order (the same order as the left-pane Section list). If no Rules are checked, the textarea MUST be empty.

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
