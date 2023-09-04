import apiClient from "./apiClient";
import { createRouter, createWebHistory } from "vue-router";
import { getStoredUser, removeStoredUser, setStoredUser } from "./userStorage";
import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import Users from "./pages/Users.vue";
import Posts from "./pages/Posts.vue";

const loginGuard = (to, from, next) => {
  const loggedInUser = getStoredUser();

  if (loggedInUser && loggedInUser.role !== "user") {
    return next("/");
  }

  return next();
};

const usersGuard = async (to, from, next) => {
  try {
    let loggedInUser = getStoredUser();

    if (!loggedInUser) {
      const { data: user } = await apiClient.get("/user");
      setStoredUser(user);
      loggedInUser = user;
    }

    if (loggedInUser.role === "admin") {
      return next();
    }

    return next("/");
  } catch (error) {
    return next("/login");
  }
};

const postsGuard = async (to, from, next) => {
  try {
    let loggedInUser = getStoredUser();

    if (!loggedInUser) {
      const { data: user } = await apiClient.get("/user");
      setStoredUser(user);
      loggedInUser = user;
    }

    if (
      loggedInUser.role === "admin" ||
      loggedInUser.role === "content_editor"
    ) {
      return next();
    }

    return next("/");
  } catch (error) {
    return next("/login");
  }
};

const dashboardGuard = async (to, from, next) => {
  try {
    let loggedInUser = getStoredUser();

    if (!loggedInUser) {
      const { data: user } = await apiClient.get("/user");
      setStoredUser(user);
      loggedInUser = user;
    }

    if (
      loggedInUser.role === "admin" ||
      loggedInUser.role === "content_editor"
    ) {
      return next();
    }

    return next("/login");
  } catch (error) {
    return next("/login");
  }
};

const routes = [
  { path: "/", component: Dashboard, beforeEnter: dashboardGuard },
  { path: "/login", component: Login, beforeEnter: loginGuard },
  { path: "/users", component: Users, beforeEnter: usersGuard },
  { path: "/posts", component: Posts, beforeEnter: postsGuard },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
