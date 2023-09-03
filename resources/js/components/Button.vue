<template>
  <button
    class="rounded text-white p-2 font-semibold cursor-pointer"
    type="button"
  >
    <font-awesome-icon v-if="icon" :icon="icon" /> <slot />
  </button>
</template>
<script setup>
import { defineProps } from "vue";

const { icon } = defineProps(["icon"]);
</script>
