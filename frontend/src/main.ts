import { createApp } from "vue";
import App from "./App.vue";
import { loadMe } from "./authState";
import { router } from "./router";
import "./styles.css";

async function boot() {
  await loadMe();
  createApp(App).use(router).mount("#app");
}

void boot();
