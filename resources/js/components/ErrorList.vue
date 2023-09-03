<template>
  <ul class="text-red-400 text-sm" v-if="errors && typeof errors === 'object'">
    <li v-for="(value, index) in errors" :key="index" class="list-none">
      {{ value[0] }}
    </li>
  </ul>
  <p class="text-red-400 text-sm" v-if="errors && typeof errors === 'string'">
    {{ errors }}
  </p>
</template>
<script setup>
const props = defineProps(["errors"]);
</script>
