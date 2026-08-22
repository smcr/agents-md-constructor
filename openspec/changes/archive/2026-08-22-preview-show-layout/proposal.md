## Why

The **Показать** preview is hard to scan: extra blank lines sit between titles and descriptions, Rules are not visually marked as list items, Sections are only one blank line apart, and the English `Checks:` heading plus blank lines between checks make the assembled AGENTS.md look unfinished.

## What Changes

- Always include Section `description` and Rule `description` in the preview when they have text. Omit empty or whitespace-only descriptions entirely (no placeholder blank line).
- No blank line between a Section title and its description, and none between a Rule title and its description.
- After a non-empty Section `description`, one blank line before the first Rule. If the Section has no description, one blank line between the Section title and the first Rule.
- Prefix each Rule title (`rule` text) with ` - `.
- Separate consecutive Rules with exactly one blank line.
- Separate consecutive Sections with exactly two blank lines (the first Section has no leading blank lines).
- After all Sections, emit one shared checklist for the whole preview: heading `## Чек-лист для проверки`, then all non-empty `checks` from selected Rules (Section order, then Rule order). Separate it from the last Rule by exactly two blank lines. Omit the heading and block when there is no check text. Never emit `Checks:`.
- Inside that block, concatenate checks with no blank lines between them.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `constructor`: preview assembly layout and the checklist heading text.

## Impact

- Frontend `assemblePreview` (`frontend/src/preview.ts`) and `frontend/scripts/smoke-preview.ts`.
- The textarea opened by **Показать**. No API or schema changes.
