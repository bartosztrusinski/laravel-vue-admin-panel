<template>
  <ul
    class="text-red-400 text-sm"
    v-for="(value, index) in errors"
    :key="index"
    v-if="typeof errors === 'object'"
  >
    <li class="list-none">{{ value[0] }}</li>
  </ul>
  <p class="text-red-400 text-sm" v-if="typeof errors === 'string'">
    {{ errors }}
  </p>
</template>
<script setup>
const props = defineProps(["errors"]);
</script>
