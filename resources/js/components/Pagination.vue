<template>
  <div class="flex flex-row justify-between items-center">
    <Button
      :disabled="isFirstPage"
      @click="prevPage"
      icon="fa-solid fa-arrow-left"
      class="px-3 bg-blue-400 hover:bg-blue-500 focus-visible:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <span class="sr-only">Previous</span>
    </Button>

    <div class="text-lg font-medium">Page {{ currentPage }}</div>

    <Button
      :disabled="isLastPage"
      @click="nextPage"
      icon="fa-solid fa-arrow-right"
      class="px-3 bg-blue-400 hover:bg-blue-500 focus-visible:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <span class="sr-only">Next</span>
    </Button>
  </div>
</template>
<script setup>
import Button from "./Button.vue";

const { isFirstPage, isLastPage, nextPage, prevPage, currentPage } =
  defineProps([
    "isFirstPage",
    "isLastPage",
    "nextPage",
    "prevPage",
    "currentPage",
  ]);
</script>
