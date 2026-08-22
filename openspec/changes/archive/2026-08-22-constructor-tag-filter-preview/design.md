## Context

Constructor already lives entirely in the Vue SPA: `ConstructorView.vue` loads all Sections and Rules, filters `approved` on the client, and keeps checkbox ids in `constructorState.ts`. Preview text is built locally by `assemblePreview` in `frontend/src/preview.ts` (no preview API). Section and Rule payloads already include `tag_ids`. See `proposal.md` for motivation and `specs/constructor/spec.md` for behavior.

## Goals / Non-Goals

**Goals:**

- Client-side AND Tag filter over existing `tag_ids`, without new endpoints.
- One aggregated `Checks:` block per Section in preview; omit the heading when there is nothing to show.
- Keep checkbox session state when the Tag filter hides a Rule.

**Non-Goals:**

- API, schema, or CRUD changes.
- Persisting Tag filter or checkbox state across reloads.
- OR matching, Tag search, or filtering by unapproved Tags.
- Changing catalog pages.

## Decisions

### 1. Filter on the client using existing `tag_ids` (AND)

Load Tags once with `GET /api/tags` alongside Sections and Rules. Show Tags with `approved === true` as a multi-select bar at the top of the right pane.

A Section or Rule matches the filter when every selected Tag id is present in its `tag_ids` (AND). Empty selection means no extra filter.

Section visibility is decided only from the Section's own tags. If a Section fails the filter, none of its Rules are shown, even when a Rule has the selected Tags. Rule tags are applied only after the Section is visible.

**Alternatives considered:** `GET /api/rules?tag_id=` for each selected Tag — the API AND is only one `tag_id`, so multiple Tags would still need client merging, and it would not implement “hide the whole Section first”. Fetching join tables separately would duplicate `tag_ids` already on the payloads.

### 2. Tag bar UI: toggle chips, session-only

Store selected Tag ids in a module-level `ref<number[]>` next to `selectedRuleIds` (or a sibling in `constructorState.ts`) so the filter survives leaving and returning to Конструктор in the same SPA session, but not a full reload. Render approved Tags as toggle buttons; selected state is visual (e.g. `.active`), not a native multi-select.

If the current `selectedSectionId` is not in the filtered Section list, set it to the first remaining visible Section, or `null` if none remain.

**Alternatives considered:** URL query for shareable filters — out of scope; checkboxes in a dropdown — chips keep all Tags visible as requested (“список Tag … вверху”).

### 3. Preview: aggregate `checks` after all selected Rules of a Section

Change `assemblePreview` so that for each Section with at least one checked Rule:

1. Emit title and Section `description` (if any).
2. Emit each checked Rule's `rule` and Rule `description` (if any) — no per-rule `Checks:`.
3. Collect that Section's checked Rules' `checks` values that are non-empty after trim.
4. If the collection is non-empty, emit one `Checks:` heading and join those values with a blank line, in Rule display order.
5. If the collection is empty, omit `Checks:` entirely.

Preview still uses all checked Rule ids, including Rules hidden by the Tag filter. Section order stays the unfiltered approved-Section order (typically `id` ascending), matching the spec.

Update `frontend/scripts/smoke-preview.ts` to cover: two Rules in one Section → one `Checks:`; all empty `checks` → no `Checks:` heading.

**Alternatives considered:** Keep per-rule `Checks:` and only hide empty ones — rejected by the request. Deduplicate identical check strings — not requested; concatenate as-is.

### 4. Visibility vs selection

Filtering only changes what is listed. Unchecking is still the only way to drop a Rule from the preview. Hidden-but-checked Rules remain in `selectedRuleIds` and reappear checked if the filter is cleared or the Rule becomes visible again.

## Risks / Trade-offs

- [A Rule with the selected Tags sits under a Section without them] → The Rule stays hidden. This is required; document it in the Tag bar with a short hint if the empty state looks like a bug.
- [User checks Rules, then filters them out, then clicks Показать] → Preview still includes those Rules. Mitigate with the existing grouping-by-Section output so the result is still readable; do not auto-uncheck.
- [Selected Section disappears after a Tag click] → Auto-select the first remaining Section so the right pane is not stuck on a hidden id.

## Migration Plan

Frontend-only. No DB migration. Deploy the SPA with the existing backend. Rollback is reverting the frontend files.

## Open Questions

None. AND matching, Section-first hiding, and preview aggregation are fixed in the specs.
