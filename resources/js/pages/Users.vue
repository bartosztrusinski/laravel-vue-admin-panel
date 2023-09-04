<template>
  <Layout>
    <h1 class="text-4xl font-semibold px-5 py-3 text-center sm:text-start">
      <font-awesome-icon icon="fa-solid fa-users" />
      Users
    </h1>

    <div
      class="shadow-sm bg-white rounded-lg sm:mx-5 p-5 lg:w-[20rem] lg:fixed lg:top-[17rem] lg:left-4 border-2 border-gray-200 my-4 lg:m-0 lg:border-none"
    >
      <h2 class="text-xl text-center font-semibold">Add new user</h2>
      <UserForm :handleSubmit="handleCreate">
        <Button
          type="submit"
          icon="fa-solid fa-plus"
          class="place-self-end mt-2 bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-700"
        >
          Create
        </Button>
      </UserForm>
    </div>

    <div class="sm:mx-5 my-2 shadow-sm relative">
      <font-awesome-icon
        icon="fa-solid fa-search"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none"
      />
      <input
        type="search"
        placeholder="Search posts"
        class="appearance-none border-2 border-gray-200 w-full p-3 pl-11 rounded-xl focus-visible:border-blue-500 focus:outline-none"
        v-model="searchTerm"
      />
    </div>

    <ul
      v-if="users.length > 0 && !isLoading"
      class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:p-5"
    >
      <li v-for="user in users" :key="user.id">
        <div
          class="p-3 rounded-lg shadow-sm border-2 border-solid border-gray-200 bg-white break-words"
        >
          <div v-if="user.id !== editedUserId">
            <h2 class="text-lg font-medium mb-1">
              <div class="inline rounded-lg px-2 py-1 border-gray-300 border-2">
                <font-awesome-icon icon="fa-solid fa-user" />
              </div>
              {{ user.name }} {{ user.surname }}
            </h2>
            <a
              :href="`mailto:${user.email}`"
              class="text-gray-600 transition-all duration-75 hover:text-indigo-600"
            >
              {{ user.email }}
            </a>

            <div
              class="flex flex-col sm:flex-row gap-2 justify-between items-end mt-2"
            >
              <div
                class="text-teal-400 font-semibold m-1 text-sm uppercase border-b-2 border-teal-400"
              >
                {{ user.role.replace("_", " ") }}
              </div>

              <div>
                <Button
                  @click="handleEdit(user.id)"
                  icon="fa-solid fa-pencil"
                  class="mr-1 bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-700"
                >
                  Edit
                </Button>
                <Button
                  @click="handleDelete(user.id)"
                  icon="fa-solid fa-trash-can"
                  class="bg-red-400 hover:bg-red-500 focus-visible:ring-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
          <UserForm v-else :handleSubmit="handleUpdate" :user="user">
            <div class="place-self-end mt-2">
              <Button
                type="submit"
                icon="fa-solid fa-check"
                class="mr-1 bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-700"
              >
                Update
              </Button>
              <Button
                @click="handleCancel"
                icon="fa-solid fa-xmark"
                class="bg-red-400 hover:bg-red-500 focus-visible:ring-red-600"
              >
                Cancel
              </Button>
            </div>
          </UserForm>
        </div>
      </li>
    </ul>
    <div v-else-if="users.length === 0">
      <h2 class="text-2xl my-5 font-medium text-center">No users found :-(</h2>
    </div>
    <div v-else class="flex flex-row items-center justify-center py-2 sm:px-5">
      <Loader />
    </div>

    <Pagination
      v-if="users.length > 0"
      :currentPage="currentPage"
      :isLastPage="currentPage === lastPage"
      :isFirstPage="currentPage === 1"
      :nextPage="nextPage"
      :prevPage="prevPage"
      class="py-2 sm:px-5"
    />
  </Layout>
</template>
<script setup>
import { ref, watchEffect, watch } from "vue";
import apiClient from "../apiClient";
import Layout from "../components/Layout.vue";
import UserForm from "../components/UserForm.vue";
import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import Loader from "../components/Loader.vue";
import Pagination from "../components/Pagination.vue";
import debounce from "../debounce";

const users = ref([]);
const editedUserId = ref(null);
const router = useRouter();
const route = useRoute();
const searchTerm = ref(route.query.search || "");
const currentPage = ref(parseInt(route.query.page) || 1);
const lastPage = ref(Infinity);
const isLoading = ref(false);

const nextPage = () => {
  currentPage.value++;
};

const prevPage = () => {
  currentPage.value--;
};

watchEffect(() => {
  if (currentPage.value > lastPage.value) {
    currentPage.value = lastPage.value;
  }

  if (currentPage.value < 1) {
    currentPage.value = 1;
  }
});

watchEffect(() => {
  const query = {
    page: currentPage.value,
  };

  if (searchTerm.value) {
    query.search = searchTerm.value;
  }

  router.push({ query });
});

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const { data } = await apiClient.get("/users", {
      params: {
        page: currentPage.value,
        search: searchTerm.value,
      },
    });

    users.value = data.data;
    lastPage.value = data.last_page;
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const debouncedFetchUsers = debounce(fetchUsers, 400);

watch(currentPage, fetchUsers, { immediate: true });
watch(searchTerm, debouncedFetchUsers);

const handleCancel = () => {
  editedUserId.value = null;
};

const handleEdit = (userId) => {
  editedUserId.value = userId;
};

const handleCreate = async (form) => {
  try {
    const { data: newUser } = await apiClient.post("/users", form);

    users.value.pop();
    users.value.unshift(newUser);
  } catch (error) {
    throw error;
  }
};

const handleUpdate = async (form, userId) => {
  try {
    const { data: updatedUser } = await apiClient.put(`/users/${userId}`, form);

    editedUserId.value = null;
    users.value = users.value.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
  } catch (error) {
    throw error;
  }
};

const handleDelete = async (userId) => {
  try {
    await apiClient.delete(`/users/${userId}`);
    users.value = users.value.filter((user) => user.id !== userId);
  } catch (error) {
    console.log(error);
  }
};
</script>
