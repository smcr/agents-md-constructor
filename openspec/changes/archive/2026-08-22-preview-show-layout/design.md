## Context

Preview text is built only in `frontend/src/preview.ts` (`assemblePreview`) and shown in the **Показать** textarea. Tag filtering and checkbox persistence stay as they are. The previous per-Section `Checks:` block is replaced by one shared checklist at the end of the preview. See `proposal.md` for motivation and `specs/constructor/spec.md` for the layout contract.

## Goals / Non-Goals

**Goals:**

- Encode the new spacing and prefixes in `assemblePreview` so the smoke script can assert exact layout.
- Keep Section title as a markdown `##` line (already used today).

**Non-Goals:**

- Constructor UI, Tag filter, API, or catalog CRUD.
- Downloading or writing an AGENTS.md file.
- Collapsing blank lines inside a single Rule's `checks` value.

## Decisions

### 1. Keep `## {section.title}`; Rule title is ` - {rule}`

Section "title" in the preview remains `## ${section.title}`. Rule "title" is the `rule` field with a leading ` - ` (space, hyphen, space). Empty descriptions (null, `""`, or whitespace-only after trim) are omitted so there is no orphan blank line under the title.

**Alternatives considered:** Drop `##` and emit plain `title` — would change the document more than requested. Prefix with `-` and no surrounding spaces — the request specified `' - '`.

### 2. Sections first, then one shared checklist

Per Section, push title, then description only when non-empty after trim, then one blank line, then Rules (no checklist). That blank line always sits before the first Rule — after the description when present, otherwise after the title. Between Rules, one empty line. Join Section blocks with `"\n\n\n"` after `trimEnd` so consecutive Sections have exactly two blank lines.

After the last Section block, collect non-empty trimmed `checks` from all selected Rules in the same walk order. If that list is non-empty, append `"\n\n\n"` (exactly two blank lines after the last Rule) plus `## Чек-лист для проверки` and the checks joined with `"\n"`. If the list is empty, emit nothing more — no heading and no extra trailing blanks.

**Alternatives considered:** One checklist per Section (previous plan) — rejected. A single blank line before the checklist — the request is two blank lines from the last Rule.

### 3. Update smoke assertions to the new heading and spacing

Point `frontend/scripts/smoke-preview.ts` at `## Чек-лист для проверки` instead of `Checks:`. Add checks for: `## Title\nDesc` with no extra newline between them; one blank line after a non-empty Section description; one blank line after the title when the description is omitted; omitted empty descriptions; ` - Rule`; one blank line between Rules; two blank lines between Sections; exactly one checklist after the last Rule (including when two Sections have checks); two blank lines before that heading; checks concatenated without a blank line; absence of `Checks:`.

## Risks / Trade-offs

- [A Rule `checks` value already contains internal blank lines] → Those stay; only the join *between* selected Rules' checks is tight.
- [Existing copied previews still say `Checks:`] → Only the live **Показать** output changes; no stored documents.

## Migration Plan

Frontend-only. Deploy the SPA. Rollback by reverting `preview.ts` and the smoke script.

## Open Questions

None.
