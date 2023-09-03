<template>
  <div class="min-h-screen bg-gray-200 pb-5">
    <Sidebar />
    <div :class="isMenuOpen ? 'max-lg:blur-xl pointer-events-none' : ''">
      <Header />
      <main class="lg:ml-[22.5rem] bg-white rounded-lg mx-4 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
<script setup>
import { inject } from "vue";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
const isMenuOpen = inject("isMenuOpen");
</script>
