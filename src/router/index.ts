import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PlayView from "../views/PlayView.vue";
import SettingsView from "../views/SettingsView.vue";
import MenuView from "../views/MenuView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "menu",
    component: MenuView,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
  },
  {
    path: "/play",
    name: "play",
    component: PlayView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
