## 1. API

- [x] 1.1 Add public `GET /api/rules/popular` before `GET /:id`; compute mean of all approved Rule `counter` and return approved Rules under approved Sections whose `counter` is strictly greater than that mean
- [x] 1.2 Accept repeated `tag_id` query params and keep only Rules (and their Sections) associated with every supplied Tag; return `[]` when there are no approved Rules
- [x] 1.3 Confirm the handler does not increment any Rule or Section `counter`

## 2. Constructor UI

- [x] 2.1 Add `api.rules.popular` that calls `GET /api/rules/popular` with the current constructor Tag ids
- [x] 2.2 Place **Часто выбирают** between **Показать** and **+** using the same `primary float-show` styles as **Показать**
- [x] 2.3 On click, fetch popular Rules, assemble preview with `assemblePreview` (ignore checkboxes), open the existing popup, and do not call increment
