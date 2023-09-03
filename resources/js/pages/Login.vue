<template>
  <div class="mx-auto max-w-md mt-10 bg-gray-200 p-4 rounded-lg">
    <div class="bg-white shadow-lg rounded-lg p-4 mb-2">
      <h1 class="pb-5 font-bold text-3xl">Login</h1>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-2">
        <label>
          <div>Email Address</div>
          <input
            class="appearance-none border-2 rounded w-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
            type="email"
            required
            v-model="form.email"
          />
        </label>
        <label>
          <div>Password</div>
          <input
            class="appearance-none border-2 rounded w-full p-2 mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent"
            type="password"
            required
            v-model="form.password"
          />
        </label>
        <ErrorList :errors="errors" />
        <div class="flex items-center justify-end mt-2">
          <Button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-800"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ErrorList from "../components/ErrorList.vue";
import apiClient from "../apiClient";
import { setStoredUser } from "../userStorage";
import Button from "../components/Button.vue";

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
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = Object.values(error.response.data.errors);
    } else {
      errors.value = error.response.data.message;
    }
  }
};
</script>
