import apiClient from "./apiClient";
import { createRouter, createWebHistory } from "vue-router";
import { getStoredUser, setStoredUser } from "./userStorage";
import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import Users from "./pages/Users.vue";
import Posts from "./pages/Posts.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/login", component: Login },
  { path: "/users", component: Users },
  { path: "/posts", component: Posts },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const loggedInUser = getStoredUser();

    if (to.path === "/login" && loggedInUser) {
      return next("/");
    }

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
