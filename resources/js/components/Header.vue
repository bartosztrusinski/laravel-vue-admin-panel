<template>
  <header
    class="bg-white flex justify-between items-center px-2 sm:px-4 h-14 z-10 mb-4 sticky top-0 shadow-md"
  >
    <h1 class="font-bold text-xl sm:text-2xl font-mono text-blue-600">
      <font-awesome-icon
        icon="fa-solid fa-shield-halved"
        class="mr-1"
      />AdminPanel
    </h1>
    <div class="flex justify-center items-center gap-3">
      <Button
        icon="fa-solid fa-arrow-right-from-bracket"
        @click="handleLogout"
        class="hover:bg-blue-200 text-black font-normal hover:text-blue-800 rounded-lg focus-visible:ring-blue-600"
      >
        Logout
      </Button>
      <Button
        @click="isMenuOpen = true"
        icon="fa-solid fa-bars"
        class="lg:hidden text-black text-xl hover:bg-blue-200 hover:text-blue-800 rounded-lg px-3 py-1 focus-visible:ring-blue-600"
      >
      </Button>
    </div>
  </header>
</template>
<script setup>
import { inject } from "vue";
import { removeStoredUser } from "../userStorage";
import apiClient from "../apiClient";
import router from "../router";
import Button from "./Button.vue";

const isMenuOpen = inject("isMenuOpen");
const handleLogout = async () => {
  try {
    await apiClient.post("/logout");
    removeStoredUser();
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};
</script>
