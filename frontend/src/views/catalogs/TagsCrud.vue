<template>
  <div>
    <div class="row">
      <h1>Tag</h1>
      <button class="primary" type="button" @click="startCreate">Добавить</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <form v-if="editing" class="form" @submit.prevent="save">
      <label>Title <input v-model="form.title" required /></label>
      <label class="checkbox"><input v-model="form.approved" type="checkbox" /> approved</label>
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tag in tags" :key="tag.id">
          <td>{{ tag.id }}</td>
          <td>{{ tag.title }}</td>
          <td>{{ tag.approved }}</td>
          <td>
            <button class="ghost" type="button" @click="startEdit(tag)">Изменить</button>
            <button class="danger" type="button" @click="remove(tag.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api, type Tag } from "../../api";

const tags = ref<Tag[]>([]);
const error = ref("");
const editing = ref(false);
const form = reactive({ id: 0, title: "", approved: false });

async function load() {
  error.value = "";
  try {
    tags.value = await api.tags.list();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function startCreate() {
  editing.value = true;
  form.id = 0;
  form.title = "";
  form.approved = false;
}

function startEdit(tag: Tag) {
  editing.value = true;
  form.id = tag.id;
  form.title = tag.title;
  form.approved = tag.approved;
}

async function save() {
  error.value = "";
  try {
    const payload = { title: form.title, approved: form.approved };
    if (form.id) {
      await api.tags.update(form.id, payload);
    } else {
      await api.tags.create(payload);
    }
    editing.value = false;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

async function remove(id: number) {
  error.value = "";
  try {
    await api.tags.remove(id);
    if (form.id === id) editing.value = false;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

onMounted(load);
</script>
