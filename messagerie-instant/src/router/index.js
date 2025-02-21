import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import SalonsView from "../views/SalonsView.vue";

const routes = [
  { path: "/", name: "Salons", component: SalonsView },
  { path: "/login", name: "Login", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
