## Context

Constructor is public. Catalog POST/PATCH/DELETE (except Rule counter increment) require a session. Constructor already lists approved Sections for the left pane. See `proposal.md` and `specs/` for behavior.

## Goals / Non-Goals

**Goals:**

- Public propose endpoints that cannot set `approved=true`.
- Keep existing `POST /api/sections` and `POST /api/rules` authenticated so Справочники create can still set `approved`.

**Non-Goals:**

- Captcha, rate limits, or moderation queue UI beyond `approved=false` + existing CRUD.
- Creating new Tags from the propose forms.
- Showing the new unapproved item in the constructor immediately.

## Decisions

### 1. Dedicated propose endpoints

`POST /api/sections/propose` and `POST /api/rules/propose` are public. They accept the form fields (`title`, `description` / `section_id`, `rule`, `checks`, `description`) plus optional `tag_ids`. They always persist `approved=false`, `counter=0`. Ignore extra `approved` in the body. Attach listed Tags in the same create if every `tag_id` exists; otherwise reject.

Register these routes **before** `/:id` so `propose` is not parsed as an id.

**Alternatives considered:** Reuse `POST /api/sections` without auth and strip `approved` — a missed strip would let guests publish. Separate tables for proposals — extra model for no gain; editors already approve in Справочники.

### 2. Floating + next to Показать

Same bottom bar as **Показать** (`float-show`). **+** sits beside it. Clicking **+** toggles a small menu with **предложить раздел** and **предложить правило**. Forms reuse `.popup-backdrop` / `.popup` (smaller than the preview). On successful save, close the popup; on error, keep it open and show the message.

Dropdown for Rule `section_id` uses already-loaded constructor Sections filtered by `approved=true` (same list as the left pane without Tag filter). Do not require a selected Section in the left pane. Tag checkboxes use already-loaded approved Tags.

**+** is visible to guests and signed-in users.

## Risks / Trade-offs

- [Public create can be spammed] → Records stay unapproved; editors delete junk in Справочники. Rate limits later if needed.
- [Guest can propose a Rule on any existing Section, including unapproved, via API] → UI only lists approved Sections; API still requires the Section to exist.

## Migration Plan

Deploy backend (new routes) then frontend. No schema change. Rollback: remove the + UI and propose routes; leftover unapproved rows remain in the catalog.

## Open Questions

None.
