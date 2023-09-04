<template>
  <ul v-if="tags.size > 0" class="flex flex-row flex-wrap gap-1">
    <li
      v-for="tag in tags"
      :key="tag"
      class="rounded-full text-white px-2 py-1 font-light text-xs bg-blue-400"
    >
      #{{ tag }}
      <button
        v-if="editable === true"
        type="button"
        class="bg-blue-500 hover:bg-blue-600 rounded-full px-1 cursor-pointer transition-all duration-75"
        @click="handleDelete(tag)"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </li>
  </ul>
</template>
<script setup>
const { tags, editable } = defineProps(["tags", "editable"]);
const handleDelete = (tag) => {
  tags.delete(tag);
};
</script>
