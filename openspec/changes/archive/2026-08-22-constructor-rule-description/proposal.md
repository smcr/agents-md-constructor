## Why

The constructor lists only the Rule title (`rule`). Editors cannot see a filled `description` while choosing Rules, so they miss context that already exists in the catalog.

## What Changes

- On Конструктор, under each listed Rule, show that Rule's `description` when it is non-empty after trim.
- Style the description smaller and paler than the Rule title so it stays secondary.
- Omit the description line when it is empty or whitespace-only.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `constructor`: the right-pane Rule list shows an optional, visually quieter description under each Rule title.

## Impact

- Frontend only: `ConstructorView.vue` and a small CSS class. No API or schema change. Preview assembly is unchanged.
