<template>
  <aside
    :class="`${isMenuOpen ? 'w-72 sm:w-96 p-4 block fixed' : 'w-0 hidden'}
     bg-white top-4 right-4 rounded-lg shadow-sm overflow-hidden transition-all duration-200 lg:fixed lg:block lg:top-[4.5rem] lg:w-80 lg:left-4 lg:p-4 max-lg:z-20`"
  >
    <ul class="text-lg">
      <li class="flex justify-end items-center lg:hidden pb-1">
        <font-awesome-icon
          icon="fa-solid fa-xmark"
          @click="closeMenu"
          class="text-red-500 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-100"
        />
      </li>
      <li class="pb-1">
        <RouterLink
          to="/"
          @click="closeMenu"
          class="block p-2 hover:bg-blue-200 hover:text-blue-800 rounded-lg"
          active-class="bg-gray-100 font-semibold"
        >
          <font-awesome-icon icon="fa-solid fa-home" class="mr-2" />
          Dashboard
        </RouterLink>
      </li>
      <li class="pb-1">
        <RouterLink
          to="/users"
          @click="closeMenu"
          class="block p-2 hover:bg-blue-200 hover:text-blue-800 rounded-lg"
          active-class="bg-gray-100 font-semibold"
        >
          <font-awesome-icon icon="fa-solid fa-users" class="mr-2" />
          Users
        </RouterLink>
      </li>
      <li class="pb-1">
        <RouterLink
          to="/posts"
          @click="closeMenu"
          class="block p-2 hover:bg-blue-200 hover:text-blue-800 rounded-lg"
          active-class="bg-gray-100 font-semibold"
        >
          <font-awesome-icon icon="fa-solid fa-message" class="mr-2" />
          Posts
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
<script setup>
import { inject } from "vue";
const isMenuOpen = inject("isMenuOpen");
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
