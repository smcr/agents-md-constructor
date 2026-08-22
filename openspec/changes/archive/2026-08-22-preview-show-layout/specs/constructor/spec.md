## MODIFIED Requirements

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
