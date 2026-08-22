## Why

`Rule.counter` is stored but never updated automatically, so there is no record of how often a Rule is included when editors open **Показать**. Usage of rules in assembled AGENTS.md should be counted.

## What Changes

- Clicking **Показать** increments `counter` by 1 for every currently checked Rule (the same set as the preview, including Rules hidden by the Tag filter).
- Each click increments once; if no Rules are checked, no counters change.
- The increment is persisted in the database (atomic `+1`, not a client-computed overwrite).
- `Section.counter` is unchanged.
- The preview popup still opens even if some increments fail; a failure is reported in the constructor error area.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `constructor`: **Показать** increments selected Rule counters.
- `catalog`: atomic increment of a Rule's `counter`.

## Impact

- Backend: new increment API for Rule `counter`.
- Frontend: constructor **Показать** handler calls that API for each selected Rule and refreshes local Rule `counter` values.
- Справочники Rule list will show the updated counter after reload/navigation. No schema migration (field already exists).
