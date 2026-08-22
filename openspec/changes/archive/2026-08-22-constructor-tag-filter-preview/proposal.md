## Why

The constructor preview repeats a `Checks:` heading per Rule and shows it even when checks are empty. Editors also cannot narrow Sections and Rules by Tag, so assembling AGENTS.md from a large catalog is slower than it needs to be.

## What Changes

- Preview (`Показать`): omit the `Checks:` heading when a Section has no check text to show.
- Preview: for each Section, emit a single `Checks:` block that concatenates the non-empty `checks` of all selected Rules in that Section (instead of one block per Rule).
- Constructor main pane: a multi-select list of Tags with `approved=true` at the top.
- When one or more Tags are selected (AND): hide Sections that do not have every selected Tag, including all of their Rules even if a Rule has those Tags; among remaining Sections, hide Rules that do not have every selected Tag.
- When no Tags are selected: show all approved Sections and their approved Rules (unchanged aside from the Tag bar).
- Constructor continues to show only `approved=true` Sections and Rules.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `constructor`: tag filter in the constructor UI; aggregated `Checks:` block in the preview; approved-only listing remains required.

## Impact

- Frontend constructor page (Tag bar, Section/Rule visibility) and `assemblePreview` used by **Показать**.
- No API or schema changes: Tag associations already exist on Section and Rule (`tag_ids`).
- Checkbox selections stay session-scoped and are not cleared by Tag filtering.
