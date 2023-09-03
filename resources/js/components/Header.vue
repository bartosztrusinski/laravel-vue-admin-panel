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
      <button
        type="button"
        @click="handleLogout"
        class="cursor-pointer hover:bg-blue-200 hover:text-blue-800 rounded-lg p-2"
      >
        Logout
        <font-awesome-icon
          icon="fa-solid fa-arrow-right-from-bracket"
          class="ml-1"
        />
      </button>
      <button
        type="button"
        @click="isMenuOpen = true"
        class="cursor-pointer lg:hidden text-xl hover:bg-blue-200 hover:text-blue-800 rounded-lg px-2 py-1"
      >
        <font-awesome-icon icon="fa-solid fa-bars" />
      </button>
    </div>
  </header>
</template>
<script setup>
import { inject } from "vue";
import { removeStoredUser } from "../userStorage";
import apiClient from "../apiClient";
import router from "../router";

const isMenuOpen = inject("isMenuOpen");
const handleLogout = async () => {
  try {
    await apiClient.post("/logout");
    removeStoredUser();
    router.push("/login");
  } catch (e) {
    console.log(e);
  }
};
</script>
