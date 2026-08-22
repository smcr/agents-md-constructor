<template>
  <div>
    <div class="row">
      <h1>Rule</h1>
      <button class="primary" type="button" @click="startCreate">Добавить</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <form v-if="editing" class="form" @submit.prevent="save">
      <label>
        Section
        <select v-model.number="form.section_id" required>
          <option disabled value="0">Выберите Section</option>
          <option v-for="section in sections" :key="section.id" :value="section.id">
            {{ section.title }}
          </option>
        </select>
      </label>
      <label>Rule <textarea v-model="form.rule" rows="3" required /></label>
      <label>Checks <textarea v-model="form.checks" rows="3" /></label>
      <label>Description <textarea v-model="form.description" rows="2" /></label>
      <label>Counter <input v-model.number="form.counter" type="number" /></label>
      <label class="checkbox"><input v-model="form.approved" type="checkbox" /> approved</label>
      <div v-if="form.id" class="tags">
        <label v-for="tag in tags" :key="tag.id" class="checkbox">
          <input
            type="checkbox"
            :checked="form.tag_ids.includes(tag.id)"
            @change="toggleTag(tag.id, ($event.target as HTMLInputElement).checked)"
          />
          {{ tag.title }}
        </label>
      </div>
      <div class="row">
        <button class="primary" type="submit">Сохранить</button>
        <button class="ghost" type="button" @click="editing = false">Отмена</button>
      </div>
    </form>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>section</th>
          <th>rule</th>
          <th>approved</th>
          <th>tags</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rule in rules" :key="rule.id">
          <td>{{ rule.id }}</td>
          <td>{{ sectionTitle(rule.section_id) }}</td>
          <td>{{ rule.rule }}</td>
          <td>{{ rule.approved }}</td>
          <td>{{ tagTitles(rule.tag_ids) }}</td>
          <td>
            <button class="ghost" type="button" @click="startEdit(rule)">Изменить</button>
            <button class="danger" type="button" @click="remove(rule.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api, type Rule, type Section, type Tag } from "../../api";

const rules = ref<Rule[]>([]);
const sections = ref<Section[]>([]);
const tags = ref<Tag[]>([]);
const error = ref("");
const editing = ref(false);
const form = reactive({
  id: 0,
  section_id: 0,
  rule: "",
  checks: "",
  description: "",
  counter: 0,
  approved: false,
  tag_ids: [] as number[],
});

async function load() {
  error.value = "";
  try {
    [rules.value, sections.value, tags.value] = await Promise.all([
      api.rules.list(),
      api.sections.list(),
      api.tags.list(),
    ]);
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function startCreate() {
  editing.value = true;
  form.id = 0;
  form.section_id = 0;
  form.rule = "";
  form.checks = "";
  form.description = "";
  form.counter = 0;
  form.approved = false;
  form.tag_ids = [];
}

function startEdit(rule: Rule) {
  editing.value = true;
  form.id = rule.id;
  form.section_id = rule.section_id;
  form.rule = rule.rule;
  form.checks = rule.checks ?? "";
  form.description = rule.description ?? "";
  form.counter = rule.counter;
  form.approved = rule.approved;
  form.tag_ids = [...rule.tag_ids];
}

async function save() {
  error.value = "";
  if (!form.section_id) {
    error.value = "Выберите Section";
    return;
  }
  try {
    const payload = {
      section_id: form.section_id,
      rule: form.rule,
      checks: form.checks.trim() || null,
      description: form.description || null,
      counter: form.counter,
      approved: form.approved,
    };
    if (form.id) {
      await api.rules.update(form.id, payload);
    } else {
      const created = await api.rules.create(payload);
      form.id = created.id;
    }
    editing.value = false;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

async function toggleTag(tagId: number, checked: boolean) {
  if (!form.id) return;
  try {
    const updated = checked
      ? await api.rules.attachTag(form.id, tagId)
      : await api.rules.detachTag(form.id, tagId);
    form.tag_ids = updated.tag_ids;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

async function remove(id: number) {
  error.value = "";
  try {
    await api.rules.remove(id);
    if (form.id === id) editing.value = false;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function sectionTitle(id: number): string {
  return sections.value.find((section) => section.id === id)?.title ?? String(id);
}

function tagTitles(ids: number[]): string {
  return tags.value
    .filter((tag) => ids.includes(tag.id))
    .map((tag) => tag.title)
    .join(", ");
}

onMounted(load);
</script>
