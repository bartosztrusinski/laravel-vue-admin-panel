<template>
  <Layout>
    <h1 class="text-4xl font-semibold px-5 py-3 text-center sm:text-start">
      <font-awesome-icon icon="fa-solid fa-users" />
      Users
    </h1>

    <form
      @submit.prevent="handleCreate"
      class="flex flex-col gap-1 shadow-sm bg-white rounded-lg sm:mx-5 p-5 lg:w-[20rem] lg:fixed lg:top-[17rem] lg:left-4 border-2 border-gray-200 my-4 lg:m-0 lg:border-none"
    >
      <h2 class="text-xl text-center font-semibold">Add new user</h2>
      <label v-for="(_, key) in createForm">
        <div class="first-letter:uppercase">
          {{ key }}
        </div>
        <input
          v-if="key !== 'role'"
          :type="['email', 'password'].includes(key) ? key : 'text'"
          :placeholder="`Enter ${key}`"
          v-model="createForm[key]"
          class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
        />
        <select
          v-else
          v-model="createForm[key]"
          class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
        >
          <option value="" disabled selected>Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="content_editor">Content Editor</option>
        </select>
      </label>

      <ErrorList :errors="createErrors" />

      <button
        type="submit"
        class="bg-emerald-500 rounded text-white p-2 mt-2 place-self-end font-semibold"
      >
        <font-awesome-icon icon="fa-solid fa-plus" />
        Create
      </button>
    </form>

    <ul
      v-if="users.length > 0"
      class="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:p-5"
    >
      <li v-for="user in users" :key="user.id">
        <div
          v-if="user.id !== originalUserId"
          class="p-3 rounded-lg shadow-sm border-2 border-solid border-gray-200 bg-white break-words"
        >
          <h2 class="text-lg font-medium mb-1">
            <div class="inline rounded-lg px-2 py-1 border-gray-300 border-2">
              <font-awesome-icon icon="fa-solid fa-user" />
            </div>
            {{ user.name }} {{ user.surname }}
          </h2>
          <a :href="`mailto:${user.email}`" class="text-gray-600">{{
            user.email
          }}</a>

          <div
            class="flex flex-col sm:flex-row gap-2 justify-between items-end mt-2"
          >
            <div
              class="text-teal-400 font-semibold m-1 text-sm uppercase border-b-2 border-teal-400"
            >
              {{ user.role.replace("_", " ") }}
            </div>

            <div>
              <button
                @click="handleEdit(user.id)"
                class="p-2 mr-1 bg-amber-500 text-white rounded font-semibold"
              >
                <font-awesome-icon icon="fa-solid fa-pencil" />
                Edit
              </button>
              <button
                @click="handleDelete(user.id)"
                class="p-2 bg-red-400 text-white rounded font-semibold"
              >
                <font-awesome-icon icon="fa-solid fa-trash-can" />
                Delete
              </button>
            </div>
          </div>
        </div>
        <div
          v-else
          class="p-3 rounded-lg shadow-sm border-2 border-solid border-gray-200 bg-white"
        >
          <form
            @submit.prevent="handleUpdate(user.id)"
            class="flex flex-col gap-1"
          >
            <label v-for="(_, key) in editForm">
              <div class="first-letter:uppercase">
                {{ key }}
              </div>
              <input
                v-if="key !== 'role'"
                :type="key === 'email' ? key : 'text'"
                v-model="editForm[key]"
                :placeholder="`Enter ${key}`"
                class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
              />
              <select
                v-else
                v-model="editForm[key]"
                class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="content_editor">Content Editor</option>
              </select>
            </label>

            <ErrorList :errors="editErrors" />

            <div class="place-self-end mt-2">
              <button
                type="submit"
                class="bg-emerald-500 rounded text-white p-2 mr-1 font-semibold"
              >
                <font-awesome-icon icon="fa-solid fa-check" />
                Update
              </button>
              <button
                type="button"
                @click="handleCancel"
                class="bg-red-400 rounded text-white p-2 font-semibold"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </Layout>
</template>
<script setup>
import { ref } from "vue";
import apiClient from "../apiClient";
import ErrorList from "../components/ErrorList.vue";
import Layout from "../components/Layout.vue";

const users = ref([]);
const createErrors = ref();
const createForm = ref({
  email: "",
  name: "",
  surname: "",
  password: "",
  role: "",
});

const editErrors = ref();
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
    createErrors.value = {};
  } catch (error) {
    createErrors.value = error.response.data.errors;
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
    createErrors.value = {};
    originalUserId.value = null;
  } catch (error) {
    createErrors.value = error.response.data.errors;
  }
};

const handleDelete = async (userId) => {
  try {
    await apiClient.delete(`/users/${userId}`);
    users.value = users.value.filter((user) => user.id !== userId);
  } catch (error) {
    createErrors.value = error.response.data.errors;
  }
};

apiClient
  .get("/users")
  .then((response) => (users.value = response.data))
  .catch((error) => console.log(error));
</script>
