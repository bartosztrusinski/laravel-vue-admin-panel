<template>
  <button
    class="appearance-none rounded text-white p-2 font-semibold cursor-pointer transition-all duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent"
    type="button"
  >
    <font-awesome-icon v-if="icon" :icon="icon" /> <slot />
  </button>
</template>
<script setup>
const { icon } = defineProps(["icon"]);
</script>
