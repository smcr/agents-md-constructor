## Why

В Справочниках кнопка **Удалить** сразу вызывает API. Случайный клик безвозвратно удаляет Section, Rule, Tag или User.

## What Changes

- Перед удалением записи в CRUD Справочников (Section, Rule, Tag, Users) система спрашивает подтверждение.
- Подтверждение — удаление идёт как сейчас.
- Отмена — запрос на удаление не отправляется, запись остаётся.
- Снятие Tag с Section/Rule без отдельного подтверждения (это не кнопка **Удалить**).
- API удаления не меняется.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `catalog`: подтверждение перед удалением записи из CRUD Справочников

## Impact

- Frontend: `SectionsCrud.vue`, `RulesCrud.vue`, `TagsCrud.vue`, `UsersCrud.vue`.
- Backend и схема БД без изменений.
