## Технический стек

Бекенд - nodejs, postgresql
Фронтенд - Vue

Локальная разработка - Docker + docker compose
Прод в k8s

## Сборка проекта
 - Добавить Makefile со всеми необходимыми для разработки команды
 - Для прода фронт и бек собираются в один образ (доббавить в makefile команду для сбборки)

## Описание проекта
Задача проекта - помочь сформировать файл AGENTS.md на основе правил(Rule) из базы данных, это своего вроде конструктор.
Проект состоит из бекенда и фронтенда. 
Задача Бекенда обеспечить:
 - CRUD API для сущностей: `Section`, `Rule`, `Tag`
 - API для добавления и удаления `Teg` для `Section`
 - API для добавления и удаления `Teg` для `Rule`
 - API для поиска `Rule` по `Tag` и `Section`
Задача для Фронтенда:
 - В ТОП-меню 2 кнопки Справочники и Конструктор
 -- Если открыта страница Справочники, то 
 --- В левом вертикальном меню кнопки `Section`, `Rule`, `Tag`. Каждая кнопка отрывает в правой зоне CRUD для соответствующей сущности
 -- Если открыта страница Конструктор
 --- В левой части перечень записей из сущности Section, выводить как кнопки, текст кнопки - поле title. Выводить section только apvoved=true
 --- в правой части выводить связанные с выбранным Section записи из таблицы Rule у которых apvoved=true
 --- перед каждым Rule чекбокс, запоминать отмеченные чекбоксы
 --- не забывать отмеченные чекбоксы при смены Section
 -- Внизу страницы плавающая кнопка, в 50px от низа с текстом "Показать" 
 -- При нажатии открыть popup на 80% экрана, в нем textarea на 90% popup
 -- в textarea выведены все
 --- Section.description для тех section у которых есть отмеченные чекбоксом Rule
 --- Все отмеченные rule для текущей Section


## PlantUml ER схема
```plantuml
entity Section {
  *id : number <<generated>>
  --
  *title : text
  description : text
  counter: number
  apvoved: boolean
}

entity Rule {
  *id : number <<generated>>
  --
  *section_id : number <<FK>>
  description : text
  *rule: text
  *checks: text
  counter: number
  apvoved: boolean
}

entity Tag{
  *id : number <<generated>>
  --
  *title : text
  apvoved: boolean
}

entity TagRule{
  *tag_id : number <<FK>>
  *rule_id : number <<FK>>
}
entity TagSection {
  *tag_id : number <<FK>>
  *section_id : number <<FK>>
}

Section::id ||--{ Rule::section_id 
TagRule::tag_id }--{ Tag::id
TagRule::rule_id }-{ Rule ::id
TagSection::tag_id }--{ Tag::id
TagSection::section_id }-{ Section::id
```


