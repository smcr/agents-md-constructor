import { ref } from "vue";
import { api, type User } from "./api";

export const currentUser = ref<User | null>(null);
export const loginPopupOpen = ref(false);
export const pendingCatalogs = ref(false);

export async function loadMe() {
  try {
    currentUser.value = await api.auth.me();
  } catch {
    currentUser.value = null;
  }
}

export async function login(loginValue: string, password: string) {
  currentUser.value = await api.auth.login({ login: loginValue, password });
}

export async function logout() {
  await api.auth.logout();
  currentUser.value = null;
}
