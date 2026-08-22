## 1. Backend increment API

- [x] 1.1 Add `POST /api/rules/:id/counter` that atomically increments `counter` by 1 and returns the Rule
- [x] 1.2 Return 404 when the Rule does not exist

## 2. Constructor

- [x] 2.1 Add `api.rules.increment` in the frontend client
- [x] 2.2 On **Показать**, increment every checked Rule (including Tag-hidden), skip when none are checked, merge successful responses into local state
- [x] 2.3 Open the preview even if some increments fail, and show an error for failures
