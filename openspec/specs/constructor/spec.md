# constructor Specification

## Purpose

Lets editors pick approved Rules across Sections and preview an assembled AGENTS.md document in a popup textarea without writing the file by hand.

## Requirements

### Requirement: Top navigation between Справочники and Конструктор
The frontend SHALL show a top menu with **Конструктор** for everyone, including guests. **Справочники** MUST appear in the top menu only when the visitor is authenticated and MUST be available only to authenticated users. Clicking **Конструктор** MUST open the constructor page. Clicking **Справочники** when authenticated MUST open the Справочники page. A guest MUST NOT see the Справочники button. If a guest opens or is sent to Справочники, the catalog MUST NOT be shown and the visitor MUST be prompted to sign in (authorization popup).

#### Scenario: Open Конструктор from the top menu
- **WHEN** the user clicks Конструктор
- **THEN** the Конструктор page is shown

#### Scenario: Open Конструктор as a guest
- **WHEN** a guest clicks Конструктор
- **THEN** the Конструктор page is shown without requiring login

#### Scenario: Open Справочники from the top menu
- **WHEN** an authenticated user clicks Справочники
- **THEN** the Справочники page is shown

#### Scenario: Guest does not see Справочники
- **WHEN** the visitor is not authenticated
- **THEN** the top menu does not show Справочники

#### Scenario: Guest clicks Справочники
- **WHEN** a guest clicks Справочники
- **THEN** the Справочники CRUD workspace is not shown and the authorization popup is opened

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

### Requirement: Approved Sections in the constructor left pane
On the Конструктор page the left pane SHALL list only Sections whose `approved` is true and that pass the current Tag filter (see Constructor Tag filter). Each Section MUST be rendered as a button whose label is the Section `title`. Unapproved Sections MUST NOT appear.

#### Scenario: List approved Sections
- **WHEN** the user opens Конструктор with no Tags selected and at least one Section has `approved` true
- **THEN** the left pane shows a button for each approved Section titled with that Section's `title`

#### Scenario: Hide unapproved Sections
- **WHEN** a Section has `approved` false
- **THEN** that Section is not listed in the constructor left pane

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

### Requirement: Floating Часто выбирают button
The Конструктор page SHALL show a floating button labeled **Часто выбирают** between the floating **Показать** button and the **+** button. The button MUST use the same visual style as **Показать**. The button MUST be available without login.

#### Scenario: Button sits between Показать and plus
- **WHEN** the user is on the Конструктор page
- **THEN** the floating row shows **Показать**, then **Часто выбирают**, then **+**, and **Часто выбирают** looks like **Показать**

#### Scenario: Guest can use Часто выбирают
- **WHEN** a guest is on Конструктор
- **THEN** **Часто выбирают** is visible and can be clicked without login

### Requirement: Propose menu next to Показать
The Конструктор page SHALL show a **+** button after the floating **Часто выбирают** button (which is after **Показать**). Clicking **+** MUST reveal two actions: **предложить раздел** and **предложить правило**. These actions MUST be available without login.

#### Scenario: Reveal propose actions
- **WHEN** the user clicks +
- **THEN** the buttons предложить раздел and предложить правило are shown

#### Scenario: Guest can open the propose menu
- **WHEN** a guest is on Конструктор and clicks +
- **THEN** the propose actions are shown without requiring login

### Requirement: Propose Section form
Clicking **предложить раздел** SHALL open a popup form with `title`, `description`, and a multi-select of Tags whose `approved` is true. Saving MUST create a proposed Section with the selected Tags and close the popup. `title` MUST be required.

#### Scenario: Save a Section proposal
- **WHEN** the user fills title (and optionally description and Tags) and clicks Сохранить
- **THEN** a Section is stored with the selected Tags and the popup closes

#### Scenario: Cancel or close without saving
- **WHEN** the user closes the Section proposal popup without saving
- **THEN** no Section is created

### Requirement: Propose Rule form
Clicking **предложить правило** SHALL open a popup form with `section_id`, `rule`, `checks`, `description`, and a multi-select of Tags whose `approved` is true. The `section_id` field MUST be a dropdown of Sections whose `approved` is true. Saving MUST create a proposed Rule with the selected Tags and close the popup. `section_id` and `rule` MUST be required.

#### Scenario: Dropdown lists only approved Sections
- **WHEN** the user opens the Rule proposal form
- **THEN** the section_id dropdown contains only Sections with `approved` true

#### Scenario: Save a Rule proposal
- **WHEN** the user chooses an approved Section, fills rule (and optionally checks, description, and Tags), and clicks Сохранить
- **THEN** a Rule is stored with the selected Tags and the popup closes

### Requirement: Preview popup with assembled AGENTS.md
Clicking **Показать** SHALL open a popup that covers 80% of the viewport. The popup MUST contain a textarea occupying 90% of the popup. The textarea MUST contain the assembled preview text built as follows:

1. Consider only Rules that are currently checked (including checked Rules hidden by the Tag filter).
2. For each Section that has at least one checked Rule, emit the Section `title` and then that Section's `description` when the description is non-empty after trim. There MUST be no blank line between the Section title and its description. There MUST be exactly one blank line before the first Rule: after the Section description when it is present, or after the Section title when the description is empty or whitespace-only. Omit the description line when it is empty or whitespace-only.
3. Include every checked Rule for that Section, grouped under the Section. Each Rule title is the Rule `rule` text prefixed with ` - `. When the Rule `description` is non-empty after trim, emit it on the next line with no blank line between the Rule title and its description. Omit the description line when it is empty. Consecutive Rules MUST be separated by exactly one blank line.
4. After all Section/Rule blocks, emit one shared checklist for the whole preview: a single heading line `## Чек-лист для проверки`, then concatenate the non-empty `checks` of all selected Rules in Section order then Rule order, with no blank lines between checks. Separate this block from the last Rule (or that Rule's description) by exactly two blank lines. If none of the selected Rules have non-empty `checks`, omit the heading, the block, and those trailing blank lines. The preview MUST NOT contain the text `Checks:` and MUST NOT repeat the checklist per Section.

Consecutive Sections in the preview MUST be separated by exactly two blank lines. The first Section MUST NOT be preceded by blank lines. Sections MUST appear in a stable order (the same order as the left-pane Section list when no Tag filter is applied, typically `id` ascending). If no Rules are checked, the textarea MUST be empty.

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

#### Scenario: One shared checklist for all Sections
- **WHEN** the user has checked Rules in two Sections, each with non-empty `checks`, and clicks Показать
- **THEN** the preview contains exactly one line `## Чек-лист для проверки` after the last Rule, that line is separated from the last Rule by exactly two blank lines, and the following lines include every selected Rule's `checks` text with no blank line between those checks

#### Scenario: Omit checklist heading when empty
- **WHEN** the user has checked Rules and none of those Rules have non-empty `checks`
- **THEN** the preview does not contain `## Чек-лист для проверки` and does not contain `Checks:`

#### Scenario: Title and description have no blank line
- **WHEN** a Section and a Rule both have non-empty descriptions and the user clicks Показать
- **THEN** the Section title is immediately followed by the Section description, and each Rule title is immediately followed by that Rule's description, with no blank line in either pair

#### Scenario: One blank line after Section description
- **WHEN** a Section has a non-empty description and at least one checked Rule
- **THEN** there is exactly one blank line between that description and the first Rule

#### Scenario: One blank line after Section title when description is empty
- **WHEN** a Section has an empty or whitespace-only description and at least one checked Rule
- **THEN** there is exactly one blank line between the Section title and the first Rule, and no description line is emitted

#### Scenario: Omit empty descriptions
- **WHEN** a Section or Rule has an empty or whitespace-only description
- **THEN** the preview does not emit a description line for that item

#### Scenario: Rules are prefixed and separated
- **WHEN** the user has checked two Rules in the same Section and clicks Показать
- **THEN** each Rule `rule` text is prefixed with ` - ` and the two Rules are separated by exactly one blank line

#### Scenario: Two blank lines between Sections
- **WHEN** the user has checked Rules in two Sections and clicks Показать
- **THEN** the two Section blocks are separated by exactly two blank lines and the first Section has no leading blank lines

### Requirement: Frequently chosen preview popup
Clicking **Часто выбирают** SHALL open the same style of popup as **Показать**: 80% of the viewport, with a textarea occupying 90% of the popup. The textarea MUST use the same assembly rules as **Preview popup with assembled AGENTS.md**, except the set of Rules is the frequently-chosen set defined here instead of currently checked Rules.

A Rule is frequently chosen when all of the following are true:

1. The Rule `approved` is true.
2. The Rule's Section `approved` is true.
3. The Rule `counter` is strictly greater than the arithmetic mean of `counter` of every Rule whose `approved` is true (the mean MUST include approved Rules whose Section is not approved). If there are no approved Rules, the frequently-chosen set is empty.
4. When one or more Tags are selected in the constructor Tag filter, the Rule is associated with every selected Tag **and** its Section is associated with every selected Tag (AND). When no Tags are selected, Tag associations MUST NOT constrain the set.

Checkbox state MUST NOT affect the frequently-chosen set. Unapproved Rules and Rules whose Section is unapproved MUST NOT appear. Sections in the preview MUST be those that have at least one frequently-chosen Rule. If the frequently-chosen set is empty, the textarea MUST be empty.

#### Scenario: Open popup
- **WHEN** the user clicks Часто выбирают
- **THEN** a popup covering 80% of the screen opens with a textarea occupying 90% of the popup

#### Scenario: Checkboxes are ignored
- **WHEN** some Rules are checked and some are not and the user clicks Часто выбирают
- **THEN** the textarea includes only frequently-chosen Rules and does not depend on which checkboxes are checked

#### Scenario: Above-average approved Rules are included
- **WHEN** approved Rules have counters 1, 1, and 4 and no Tags are selected
- **THEN** the textarea includes the Rule whose counter is 4 and does not include the Rules whose counter is 1

#### Scenario: Equal to the mean is excluded
- **WHEN** every approved Rule has the same counter and no Tags are selected
- **THEN** the textarea is empty

#### Scenario: Tag filter uses constructor AND
- **WHEN** the user has selected Tags A and B and clicks Часто выбирают
- **THEN** the textarea includes only frequently-chosen Rules that are associated with both A and B and whose Section is associated with both A and B

#### Scenario: No Tags selected includes all popular Rules
- **WHEN** no Tags are selected and at least one Rule is frequently chosen
- **THEN** the textarea includes that Rule and its Section regardless of Tags on the Rule

#### Scenario: Unapproved Rule stays out
- **WHEN** an unapproved Rule has a counter above the approved-Rule mean
- **THEN** that Rule is not included in the textarea

#### Scenario: Empty when nothing is popular
- **WHEN** no Rule meets the frequently-chosen criteria
- **THEN** the textarea is empty

#### Scenario: Preview format matches Показать
- **WHEN** frequently-chosen Rules exist in two Sections and the user clicks Часто выбирают
- **THEN** the textarea groups those Rules under their Sections with the same title, description, spacing, and shared checklist rules as Показать

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

### Requirement: Часто выбирают does not increment counters
Clicking **Часто выбирают** MUST NOT change any Rule `counter` or Section `counter`.

#### Scenario: Counters stay the same
- **WHEN** the user clicks Часто выбирают
- **THEN** every Rule and Section `counter` is unchanged
