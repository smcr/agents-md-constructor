<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">AGENTS.md constructor</div>
      <nav>
        <RouterLink v-if="currentUser" to="/catalogs">Справочники</RouterLink>
        <RouterLink to="/constructor">Конструктор</RouterLink>
      </nav>
      <div class="auth-slot">
        <template v-if="currentUser">
          <span class="user-name">{{ currentUser.name }}</span>
          <button class="ghost" type="button" @click="onLogout">Выход</button>
        </template>
        <button v-else class="ghost" type="button" @click="loginPopupOpen = true">Войти</button>
      </div>
    </header>
    <RouterView />
    <div v-if="loginPopupOpen" class="popup-backdrop" @click.self="closeLogin">
      <div class="popup auth-popup" @click.stop>
        <div class="row">
          <strong>Вход</strong>
          <button class="ghost" type="button" @click="closeLogin">Закрыть</button>
        </div>
        <p v-if="authError" class="error">{{ authError }}</p>
        <form class="form" @submit.prevent="onLogin">
          <label>Login <input v-model="form.login" autocomplete="username" required /></label>
          <label>
            Password
            <input v-model="form.password" type="password" autocomplete="current-password" required />
          </label>
          <button class="primary" type="submit">Войти</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { currentUser, login, loginPopupOpen, logout, pendingCatalogs } from "./authState";

const router = useRouter();
const authError = ref("");
const form = reactive({ login: "", password: "" });

function closeLogin() {
  loginPopupOpen.value = false;
  authError.value = "";
  form.password = "";
}

async function onLogin() {
  authError.value = "";
  try {
    await login(form.login, form.password);
    const goCatalogs = pendingCatalogs.value;
    pendingCatalogs.value = false;
    closeLogin();
    if (goCatalogs) {
      await router.push("/catalogs");
    }
  } catch (err) {
    authError.value = err instanceof Error ? err.message : String(err);
  }
}

async function onLogout() {
  authError.value = "";
  try {
    await logout();
    if (router.currentRoute.value.path.startsWith("/catalogs")) {
      await router.push("/constructor");
    }
  } catch (err) {
    authError.value = err instanceof Error ? err.message : String(err);
  }
}
</script>
