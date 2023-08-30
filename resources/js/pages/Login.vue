<template>
  <div class="mx-auto max-w-md mt-10 bg-gray-100 p-4 rounded-lg">
    <div
      class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-2 flex flex-col"
    >
      <h1 class="py-5 font-bold text-3xl">Login</h1>
      <ul
        class="text-red-400"
        v-for="(value, index) in errors"
        :key="index"
        v-if="typeof errors === 'object'"
      >
        <li>{{ value[0] }}</li>
      </ul>
      <p class="text-red-400" v-if="typeof errors === 'string'">
        {{ errors }}
      </p>
      <form method="post" @submit.prevent="handleLogin">
        <div class="mb-4 mt-2">
          <label
            class="block text-grey-darker text-sm font-bold mb-2"
            for="username"
          >
            Email Address
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
            id="username"
            type="text"
            v-model="form.email"
            required
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-grey-darker text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
            id="password"
            type="password"
            v-model="form.password"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:border-transparent"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
    <button @click="handleLogOut">Log Out</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../apiClient";
import { setStoredUser, removeStoredUser } from "../userStorage";

const errors = ref();
const router = useRouter();
const form = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    await apiClient.get("/sanctum/csrf-cookie");
    const { data: user } = await apiClient.post("/login", {
      email: form.value.email,
      password: form.value.password,
    });

    form.value = {
      email: "",
      password: "",
    };

    setStoredUser(user);

    router.push("/");
  } catch (e) {
    if (e.response?.data?.errors) {
      errors.value = Object.values(e.response.data.errors);
    } else {
      errors.value = e?.response?.data?.message || e.message;
    }
  }
};

const handleLogOut = async () => {
  try {
    await apiClient.post("/logout");
    removeStoredUser();
  } catch (e) {
    if (e.response?.data?.errors) {
      errors.value = Object.values(e.response.data.errors);
    } else {
      errors.value = e?.response?.data?.message || e.message;
    }
  }
};
</script>
