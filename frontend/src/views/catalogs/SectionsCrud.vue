<template>
  <div>
    <div class="row">
      <h1>Section</h1>
      <button class="primary" type="button" @click="startCreate">Добавить</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <form v-if="editing" class="form" @submit.prevent="save">
      <label>Title <input v-model="form.title" required /></label>
      <label>Description <textarea v-model="form.description" rows="3" /></label>
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
          <th>title</th>
          <th>approved</th>
          <th>tags</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="section in sections" :key="section.id">
          <td>{{ section.id }}</td>
          <td>{{ section.title }}</td>
          <td>{{ section.approved }}</td>
          <td>{{ tagTitles(section.tag_ids) }}</td>
          <td>
            <button class="ghost" type="button" @click="startEdit(section)">Изменить</button>
            <button class="danger" type="button" @click="remove(section.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api, type Section, type Tag } from "../../api";

const sections = ref<Section[]>([]);
const tags = ref<Tag[]>([]);
const error = ref("");
const editing = ref(false);
const form = reactive({
  id: 0,
  title: "",
  description: "",
  counter: 0,
  approved: false,
  tag_ids: [] as number[],
});

async function load() {
  error.value = "";
  try {
    [sections.value, tags.value] = await Promise.all([api.sections.list(), api.tags.list()]);
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function startCreate() {
  editing.value = true;
  form.id = 0;
  form.title = "";
  form.description = "";
  form.counter = 0;
  form.approved = false;
  form.tag_ids = [];
}

function startEdit(section: Section) {
  editing.value = true;
  form.id = section.id;
  form.title = section.title;
  form.description = section.description ?? "";
  form.counter = section.counter;
  form.approved = section.approved;
  form.tag_ids = [...section.tag_ids];
}

async function save() {
  error.value = "";
  try {
    const payload = {
      title: form.title,
      description: form.description || null,
      counter: form.counter,
      approved: form.approved,
    };
    if (form.id) {
      await api.sections.update(form.id, payload);
    } else {
      const created = await api.sections.create(payload);
      form.id = created.id;
    }
    await load();
    editing.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

async function toggleTag(tagId: number, checked: boolean) {
  if (!form.id) return;
  try {
    const updated = checked
      ? await api.sections.attachTag(form.id, tagId)
      : await api.sections.detachTag(form.id, tagId);
    form.tag_ids = updated.tag_ids;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

async function remove(id: number) {
  if (!confirm("Удалить эту запись?")) {
    return;
  }
  error.value = "";
  try {
    await api.sections.remove(id);
    if (form.id === id) editing.value = false;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function tagTitles(ids: number[]): string {
  return tags.value
    .filter((tag) => ids.includes(tag.id))
    .map((tag) => tag.title)
    .join(", ");
}

onMounted(load);
</script>
