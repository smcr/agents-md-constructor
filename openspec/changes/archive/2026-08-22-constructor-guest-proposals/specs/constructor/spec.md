## ADDED Requirements

### Requirement: Propose menu next to Показать
The Конструктор page SHALL show a **+** button next to the floating **Показать** button. Clicking **+** MUST reveal two actions: **предложить раздел** and **предложить правило**. These actions MUST be available without login.

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
