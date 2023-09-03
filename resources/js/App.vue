<template>
  <router-view></router-view>
</template>
<script setup>
import { ref, provide } from "vue";
const isMenuOpen = ref(false);
provide("isMenuOpen", isMenuOpen);
</script>
