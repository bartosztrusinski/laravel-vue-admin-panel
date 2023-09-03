<template>
  <form @submit.prevent="submitForm" class="flex flex-col gap-1">
    <label v-for="(_, key) in form">
      <div class="first-letter:uppercase">
        {{ key }}
      </div>
      <input
        v-if="key !== 'role'"
        :type="['email', 'password'].includes(key) ? key : 'text'"
        :placeholder="`Enter ${key}`"
        v-model="form[key]"
        required
        class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
      />
      <select
        v-else
        v-model="form[key]"
        required
        class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
      >
        <option value="" disabled selected>Select role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="content_editor">Content Editor</option>
      </select>
    </label>
    <ErrorList :errors="errors" />
    <slot />
  </form>
</template>
<script setup>
import ErrorList from "../components/ErrorList.vue";
import { defineProps, ref } from "vue";

const { handleSubmit, user } = defineProps(["handleSubmit", "user"]);
const errors = ref();
const form = ref({
  email: user?.email ?? "",
  name: user?.name ?? "",
  surname: user?.surname ?? "",
  role: user?.role ?? "",
});

if (!user) {
  form.value.password = "";
}

const submitForm = async () => {
  try {
    await handleSubmit(form.value, user?.id);
    form.value = {
      email: "",
      name: "",
      surname: "",
      role: "",
      password: "",
    };
    errors.value = null;
  } catch (error) {
    errors.value = error.response.data.errors;
  }
};
</script>
