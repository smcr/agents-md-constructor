## Context

`Rule.counter` already exists (default 0) and is editable in Справочники via `PATCH /api/rules/:id`. Constructor **Показать** currently only opens the preview. See `proposal.md` for motivation and `specs/` for behavior.

## Goals / Non-Goals

**Goals:**

- Atomic persisted `+1` so concurrent clicks cannot lose updates.
- Constructor uses the same selected Rule ids as the preview.

**Non-Goals:**

- Incrementing `Section.counter`.
- Showing `counter` on the constructor Rule list.
- Deduplicating rapid double-clicks beyond one increment per click.

## Decisions

### 1. `POST /api/rules/:id/counter` with Prisma `increment: 1`

Add `POST /api/rules/:id/counter` on `rulesRouter`. Handler: `prisma.rule.update({ where: { id }, data: { counter: { increment: 1 } }, include: ruleInclude })` and return `ruleJson`. Missing Rule → 404 via Prisma `P2025` (same pattern as other routes).

Do not accept a client-supplied absolute `counter` on this route.

**Alternatives considered:** `PATCH` with `{ counter: current + 1 }` from the SPA — lost updates if two clicks overlap. Batch `POST /api/rules/increment { ids }` — fewer round-trips, extra request shape; N parallel POSTs are enough for constructor selections.

### 2. Constructor: increment then open popup

In `ConstructorView`, replace the **Показать** click with an async handler: snapshot `selectedRuleIds`; if empty, only open the popup; otherwise `Promise.allSettled` of `api.rules.increment(id)` for each id, merge successful payloads into the local `rules` array, set `error` if any request rejected, then set `showPreview = true`.

**Alternatives considered:** Open popup first, increment in the background — the spec allows the popup even on failure, but waiting keeps local `counter` in sync before the user can click again.

### 3. Frontend API helper

Add `api.rules.increment(id)` → `POST /api/rules/${id}/counter`. No Prisma migration.

## Risks / Trade-offs

- [Many selected Rules → many HTTP calls] → Parallel `allSettled`; add a batch endpoint later if this becomes slow.
- [User clicks Показать twice quickly] → Two increments, as specified.
- [Partial failure] → Successful rows stay incremented; error text lists the failure; popup still opens.

## Migration Plan

Deploy backend then frontend (or together). Rollback: remove the route and the constructor call; stored counters are left as-is.

## Open Questions

None.
