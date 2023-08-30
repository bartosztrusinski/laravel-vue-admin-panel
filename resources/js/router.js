import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import apiClient from "./apiClient";
import { getStoredUser, setStoredUser } from "./userStorage";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const loggedInUser = getStoredUser();

    if (to.path !== "/login" && !loggedInUser) {
      const { data: user } = await apiClient.get("/user");
      setStoredUser(user);
      return next();
    }
  } catch (error) {
    return next("/login");
  }

  return next();
});

export default router;
