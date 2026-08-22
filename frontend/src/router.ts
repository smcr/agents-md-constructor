import { createRouter, createWebHistory } from "vue-router";
import { currentUser, loginPopupOpen, pendingCatalogs } from "./authState";
import CatalogsView from "./views/CatalogsView.vue";
import ConstructorView from "./views/ConstructorView.vue";
import RulesCrud from "./views/catalogs/RulesCrud.vue";
import SectionsCrud from "./views/catalogs/SectionsCrud.vue";
import TagsCrud from "./views/catalogs/TagsCrud.vue";
import UsersCrud from "./views/catalogs/UsersCrud.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/constructor" },
    {
      path: "/catalogs",
      component: CatalogsView,
      redirect: "/catalogs/sections",
      children: [
        { path: "sections", component: SectionsCrud },
        { path: "rules", component: RulesCrud },
        { path: "tags", component: TagsCrud },
        { path: "users", component: UsersCrud },
      ],
    },
    { path: "/constructor", component: ConstructorView },
  ],
});

router.beforeEach((to) => {
  if (!to.path.startsWith("/catalogs") || currentUser.value) {
    return true;
  }
  pendingCatalogs.value = true;
  loginPopupOpen.value = true;
  return { path: "/constructor" };
});
