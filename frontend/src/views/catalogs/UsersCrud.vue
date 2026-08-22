<template>
  <div>
    <div class="row">
      <h1>Users</h1>
      <button class="primary" type="button" @click="startCreate">Добавить</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <form v-if="editing" class="form" @submit.prevent="save">
      <label>Login <input v-model="form.login" required /></label>
      <label>Name <input v-model="form.name" required /></label>
      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          :required="!form.id"
          :placeholder="form.id ? 'Оставьте пустым, чтобы не менять' : ''"
        />
      </label>
      <div class="row">
        <button class="primary" type="submit">Сохранить</button>
        <button class="ghost" type="button" @click="editing = false">Отмена</button>
      </div>
    </form>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>login</th>
          <th>name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.login }}</td>
          <td>{{ user.name }}</td>
          <td>
            <button class="ghost" type="button" @click="startEdit(user)">Изменить</button>
            <button
              class="danger"
              type="button"
              :disabled="currentUser?.id === user.id"
              @click="remove(user.id)"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api, type User } from "../../api";
import { currentUser, loadMe } from "../../authState";

const users = ref<User[]>([]);
const error = ref("");
const editing = ref(false);
const form = reactive({ id: 0, login: "", name: "", password: "" });

async function load() {
  error.value = "";
  try {
    users.value = await api.users.list();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

function startCreate() {
  editing.value = true;
  form.id = 0;
  form.login = "";
  form.name = "";
  form.password = "";
}

function startEdit(user: User) {
  editing.value = true;
  form.id = user.id;
  form.login = user.login;
  form.name = user.name;
  form.password = "";
}

async function save() {
  error.value = "";
  try {
    if (form.id) {
      const payload: { login: string; name: string; password?: string } = {
        login: form.login,
        name: form.name,
      };
      if (form.password) {
        payload.password = form.password;
      }
      await api.users.update(form.id, payload);
    } else {
      await api.users.create({
        login: form.login,
        name: form.name,
        password: form.password,
      });
    }
    if (form.id && form.id === currentUser.value?.id) {
      await loadMe();
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
    await api.users.remove(id);
    if (form.id === id) editing.value = false;
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
}

onMounted(load);
</script>
