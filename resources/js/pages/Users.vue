<template>
  <h1>Users</h1>
  <ul v-if="users.length > 0" class="flex flex-row bg-gray-100 p-5">
    <li v-for="user in users" :key="user.id">
      <div
        class="flex flex-col p-5 rounded-lg m-2 shadow-lg bg-white text-center"
      >
        <strong class="text-lg">{{ user.name }} {{ user.surname }}</strong>
        <a href="mailto:{{ user.email }}">{{ user.email }}</a>
        <div class="text-teal-500 font-bold uppercase">
          {{ user.role }}
        </div>
        <div class="flex gap-1 justify-end mt-3">
          <button
            @click="handleEdit"
            class="px-2 py-1 bg-blue-400 text-white rounded"
          >
            Edit
          </button>
          <button
            @click="handleDelete"
            class="px-2 py-1 bg-red-400 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>
<script setup>
import { ref } from "vue";
import apiClient from "../apiClient";

const users = ref([]);

apiClient
  .get("/users")
  .then((response) => {
    users.value = response.data;
  })
  .catch((error) => {
    console.log(error);
  });
</script>
