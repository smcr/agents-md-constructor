## 1. API

- [x] 1.1 Add public `POST /api/sections/propose` that creates a Section with `approved=false` and ignores client `approved`
- [x] 1.2 Add public `POST /api/rules/propose` that creates a Rule with `approved=false` and ignores client `approved`

## 2. Constructor UI

- [x] 2.1 Add a **+** button next to **Показать** that reveals **предложить раздел** and **предложить правило**
- [x] 2.2 Add the Section proposal popup (`title`, `description`) and save via propose API
- [x] 2.3 Add the Rule proposal popup (`section_id` approved-only dropdown, `rule`, `checks`, `description`) and save via propose API
- [x] 2.4 Add approved-Tag multi-select to both proposal forms and persist `tag_ids` on propose
