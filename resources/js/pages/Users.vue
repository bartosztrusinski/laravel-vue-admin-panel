<template>
  <div class="bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-semibold p-2">Users</h1>

    <h2 class="text-xl text-center">Create User</h2>
    <form
      @submit.prevent="handleCreate"
      class="flex flex-col gap-1 flex-grow max-w-[20rem] m-auto shadow-xl rounded px-6 py-3 bg-white"
    >
      <label v-for="(_, key) in createForm">
        <div class="first-letter:uppercase font-light text-lg">
          {{ key }}
        </div>
        <input
          v-if="key !== 'role'"
          :type="['email', 'password'].includes(key) ? key : 'text'"
          v-model="createForm[key]"
          class="w-full p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
        />
        <select
          v-else
          v-model="createForm[key]"
          class="w-full p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="content_editor">Content Editor</option>
        </select>
      </label>

      <ErrorList :errors="errors" />

      <button
        type="submit"
        class="bg-blue-400 rounded text-white px-2 py-1 my-3 place-self-end font-semibold"
      >
        Create
      </button>
    </form>

    <ul
      v-if="users.length > 0"
      class="grid grid-cols-1 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-sm m-auto sm:max-w-none"
    >
      <li v-for="user in users" :key="user.id">
        <div
          v-if="user.id !== originalUserId"
          class="flex flex-col p-5 rounded-lg m-2 shadow-lg bg-white text-center"
        >
          <h2 class="text-lg">{{ user.name }} {{ user.surname }}</h2>
          <div>{{ user.email }}</div>
          <div class="text-teal-500 font-bold uppercase">
            {{ user.role.replace("_", " ") }}
          </div>
          <div class="flex gap-1 justify-end mt-3">
            <button
              @click="handleEdit(user.id)"
              class="px-2 py-1 bg-emerald-500 text-white rounded"
            >
              Edit
            </button>
            <button
              @click="handleDelete(user.id)"
              class="px-2 py-1 bg-red-400 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col p-5 rounded-lg m-2 shadow-lg bg-white text-center"
        >
          <form
            @submit.prevent="handleUpdate(user.id)"
            class="flex flex-col gap-1 flex-grow max-w-[20rem] m-auto"
          >
            <div class="text-red-500">
              <div v-for="error in errors" :key="error">
                <div v-for="message in error" :key="message">
                  {{ message }}
                </div>
              </div>
            </div>
            <label v-for="(_, key) in editForm">
              <div class="first-letter:uppercase font-light text-lg">
                {{ key }}
              </div>
              <input
                v-if="key !== 'role'"
                :type="key === 'email' ? key : 'text'"
                v-model="editForm[key]"
                class="w-full p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
              />
              <select
                v-else
                v-model="editForm[key]"
                class="w-full p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="content_editor">Content Editor</option>
              </select>
            </label>

            <div class="place-self-end mt-3">
              <button
                type="submit"
                class="bg-emerald-500 rounded text-white px-2 py-1 mr-1 font-semibold"
              >
                Update
              </button>
              <button
                type="button"
                @click="handleCancel"
                class="bg-red-400 rounded text-white px-2 py-1 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
import apiClient from "../apiClient";
import ErrorList from "../components/ErrorList.vue";

const users = ref([]);
const errors = ref({});
const createForm = ref({
  email: "",
  name: "",
  surname: "",
  password: "",
  role: "",
});

const editForm = ref({
  email: "",
  name: "",
  surname: "",
  role: "",
});

const originalUserId = ref(null);

const handleCancel = () => {
  originalUserId.value = null;
};

const handleEdit = (userId) => {
  originalUserId.value = userId;
  const user = users.value.find((user) => user.id === userId);
  editForm.value = {
    email: user.email,
    name: user.name,
    surname: user.surname,
    role: user.role,
  };
};

const handleCreate = async () => {
  try {
    const { data: newUser } = await apiClient.post("/users", createForm.value);

    users.value.push(newUser);

    createForm.value = {
      email: "",
      name: "",
      surname: "",
      password: "",
      role: "",
    };
    errors.value = {};
  } catch (error) {
    errors.value = error.response.data.errors;
  }
};

const handleUpdate = async (userId) => {
  try {
    const { data: updatedUser } = await apiClient.put(
      `/users/${userId}`,
      editForm.value
    );

    users.value = users.value.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    editForm.value = {
      email: "",
      name: "",
      surname: "",
      role: "",
    };
    errors.value = {};
    originalUserId.value = null;
  } catch (error) {
    errors.value = error.response.data.errors;
  }
};

const handleDelete = async (userId) => {
  try {
    await apiClient.delete(`/users/${userId}`);
    users.value = users.value.filter((user) => user.id !== userId);
  } catch (error) {
    errors.value = error.response.data.errors;
  }
};

apiClient
  .get("/users")
  .then((response) => (users.value = response.data))
  .catch((error) => console.log(error));
</script>
