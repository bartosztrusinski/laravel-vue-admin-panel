<template>
  <Layout>
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold p-6">
      Welcome {{ user.name + " " + user.surname }}!
    </h1>
    <div class="flex flex-col sm:flex-row gap-5 p-5">
      <RouterLink
        to="/users"
        class="border-gray-200 border-2 border-solid rounded-lg p-12 basis-full sm:basis-1/2 hover:bg-gray-100"
      >
        <h2 class="font-semibold text-2xl">Users</h2>
        <p class="text-gray-400 text-lg">
          Click here to see, manage, create and delete users
        </p>
      </RouterLink>
      <RouterLink
        to="/posts"
        class="border-gray-200 border-2 border-solid rounded-lg p-12 basis-full sm:basis-1/2 hover:bg-gray-100"
      >
        <h2 class="font-semibold text-2xl">Posts</h2>
        <p class="text-gray-400 text-lg">
          Click here to see, manage, create and delete posts
        </p>
      </RouterLink>
    </div>
  </Layout>
</template>
<script setup>
import Layout from "../components/Layout.vue";
import { getStoredUser } from "../userStorage";

const user = getStoredUser();
</script>
