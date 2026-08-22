## Why

Guests can use the constructor but cannot add catalog content. Editors miss useful Section and Rule suggestions from people who browse the constructor without an account.

## What Changes

- On Конструктор, next to **Показать**, add a **+** control. Clicking it reveals **предложить раздел** and **предложить правило**.
- **предложить раздел** opens a form with `title`, `description`, and multi-select Tags. Save creates a Section and closes the popup.
- **предложить правило** opens a form with `section_id` (dropdown of Sections where `approved=true`), `rule`, `checks`, `description`, and multi-select Tags. Save creates a Rule and closes the popup.
- Proposals MUST work without login. Created records stay `approved=false` so they do not appear in the constructor until an editor approves them in Справочники.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `constructor`: + menu and proposal forms next to Показать; guests can submit Section and Rule proposals.
- `catalog`: unauthenticated create of a proposed Section or Rule is allowed; those creates always store `approved=false`. Other catalog writes stay authenticated.

## Impact

- Backend: public propose/create paths that force `approved=false`; existing catalog write auth stays in place for updates, deletes, tags, and User CRUD.
- Frontend: constructor floating + control, two action buttons, two popups/forms.
- Справочники: editors continue to review and set `approved=true` on incoming proposals.
