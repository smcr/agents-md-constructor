## 1. Preview assembly

- [x] 1.1 Change `assemblePreview` so each Section emits one `Checks:` block after its selected Rules, concatenating non-empty `checks` in Rule order
- [x] 1.2 Omit the `Checks:` heading entirely when a Section's selected Rules have no non-empty `checks`
- [x] 1.3 Update `frontend/scripts/smoke-preview.ts` for aggregated Checks and for omitting the heading when checks are empty
- [x] 1.4 Run the preview smoke script and confirm it passes

## 2. Tag filter state

- [x] 2.1 Add session-scoped selected Tag ids (toggle/add/remove) next to `selectedRuleIds` in `constructorState.ts`
- [x] 2.2 Load Tags with Sections and Rules in `ConstructorView` and expose only `approved=true` Tags
- [x] 2.3 Filter visible Sections with AND on `tag_ids`; hide a Section's Rules when the Section fails the filter
- [x] 2.4 Filter visible Rules of the selected Section with AND on `tag_ids`; keep unapproved Sections and Rules hidden
- [x] 2.5 If the selected Section is hidden by the filter, select the first remaining visible Section (or none)

## 3. Constructor UI

- [x] 3.1 Render a multi-select Tag list at the top of the constructor main pane
- [x] 3.2 Confirm checkbox selections stay when Tags hide a Rule and reappear when the filter is cleared
- [x] 3.3 Confirm **Показать** still includes checked Rules hidden by the Tag filter
