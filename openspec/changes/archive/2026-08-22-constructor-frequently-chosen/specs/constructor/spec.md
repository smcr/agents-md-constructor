## ADDED Requirements

### Requirement: Floating Часто выбирают button
The Конструктор page SHALL show a floating button labeled **Часто выбирают** between the floating **Показать** button and the **+** button. The button MUST use the same visual style as **Показать**. The button MUST be available without login.

#### Scenario: Button sits between Показать and plus
- **WHEN** the user is on the Конструктор page
- **THEN** the floating row shows **Показать**, then **Часто выбирают**, then **+**, and **Часто выбирают** looks like **Показать**

#### Scenario: Guest can use Часто выбирают
- **WHEN** a guest is on Конструктор
- **THEN** **Часто выбирают** is visible and can be clicked without login

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

### Requirement: Часто выбирают does not increment counters
Clicking **Часто выбирают** MUST NOT change any Rule `counter` or Section `counter`.

#### Scenario: Counters stay the same
- **WHEN** the user clicks Часто выбирают
- **THEN** every Rule and Section `counter` is unchanged

## MODIFIED Requirements

### Requirement: Propose menu next to Показать
The Конструктор page SHALL show a **+** button after the floating **Часто выбирают** button (which is after **Показать**). Clicking **+** MUST reveal two actions: **предложить раздел** and **предложить правило**. These actions MUST be available without login.

#### Scenario: Reveal propose actions
- **WHEN** the user clicks +
- **THEN** the buttons предложить раздел and предложить правило are shown

#### Scenario: Guest can open the propose menu
- **WHEN** a guest is on Конструктор and clicks +
- **THEN** the propose actions are shown without requiring login
