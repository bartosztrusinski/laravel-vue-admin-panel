<template>
  <div class="bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-semibold p-2">Posts</h1>

    <h2 class="text-xl text-center">Create Post</h2>
    <form
      @submit.prevent="handleCreate"
      class="flex flex-col gap-1 flex-grow max-w-[20rem] m-auto shadow-xl rounded px-6 py-3 bg-white"
    >
      <div v-if="errors" class="text-red-500">
        <div v-for="error in errors" :key="error">
          <div v-for="message in error" :key="message">
            {{ message }}
          </div>
        </div>
      </div>

      <label v-for="(_, key) in createForm">
        <div class="first-letter:uppercase font-light text-lg">
          {{ key }}
        </div>
        <input
          type="text"
          v-model="createForm[key]"
          class="w-full p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
        />
      </label>

      <div>
        <label>
          <div class="first-letter:uppercase font-light text-lg">tags</div>
          <input
            type="text"
            class="p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
            v-model="tag"
          />
        </label>

        <button
          type="button"
          @click="handleAddTag"
          class="bg-blue-400 rounded-e text-white px-2 py-1 font-semibold"
        >
          Add Tag
        </button>
      </div>

      <ul v-if="tags.size > 0" class="flex flex-row gap-1 pt-2">
        <li
          v-for="tag in tags"
          :key="tag"
          class="rounded-xl text-white px-2 font-light text-sm py-1 bg-blue-400"
        >
          #{{ tag }}
        </li>
      </ul>

      <button
        type="submit"
        class="bg-blue-400 rounded text-white px-2 py-1 mb-3 place-self-end font-semibold"
      >
        Create
      </button>
    </form>

    <ul
      v-if="posts.length > 0"
      class="grid grid-cols-1 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-sm m-auto sm:max-w-none"
    >
      <li v-for="post in posts" :key="post.id">
        <div
          v-if="originalPostId !== post.id"
          class="flex flex-col p-5 rounded-lg m-2 shadow-lg bg-white text-center"
        >
          <h2 class="text-xl font-semibold first-letter:uppercase">
            {{ post.title }}
          </h2>
          <div>{{ post.content }}</div>
          <div class="text-teal-500 font-light p-1 rounded-lg">
            {{ new Date(post.created_at).toLocaleString() }}
          </div>

          <ul v-if="post.tags.length > 0" class="flex flex-row gap-1 py-1">
            <li
              v-for="tag in post.tags"
              :key="tag"
              class="rounded-xl text-white px-2 font-light text-sm py-1 bg-blue-400"
            >
              #{{ tag }}
            </li>
          </ul>

          <div class="flex gap-1 justify-end mt-3">
            <button
              @click="handleEdit(post.id)"
              class="px-2 py-1 bg-emerald-500 text-white rounded"
            >
              Edit
            </button>
            <button
              @click="handleDelete(post.id)"
              class="px-2 py-1 bg-red-400 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>

        <div v-else class="flex flex-row gap-1">
          <input type="text" v-model="post.title" />
          <input type="text" v-model="post.content" />
          <button
            class="px-2 py-1 bg-green-400 text-white uppercase rounded mx-2"
            @click="handleUpdate(post)"
          >
            Update
          </button>
          <button
            class="px-2 py-1 bg-red-400 text-white uppercase rounded mx-2"
            @click="handleCancelClick"
          >
            Cancel
          </button>

          <input type="text" v-model="form.tag" />
          <button @click="handleTagCreate(post.id)">Add Tag</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import apiClient from "../apiClient";
import { ref } from "vue";

const posts = ref([]);
const errors = ref("");
const createForm = ref({
  title: "",
  content: "",
});

const editForm = ref({
  title: "",
  content: "",
});
const tag = ref("");
const tags = ref(new Set());

const originalPostId = ref(null);

const handleAddTag = () => {
  if (tag.value.length === 0) return;
  tags.value.add(tag.value);
  tag.value = "";
};

const handleCancelClick = () => {
  posts.value = posts.value.map((post) =>
    post.id === originalPost.value.id ? originalPost.value : post
  );
  originalPost.value = null;
};

const handleEditClick = (postId) => {
  const post = posts.value.find((post) => post.id === postId);
  originalPost.value = { ...post };
};

const handleCreate = async () => {
  try {
    const { data: newPost } = await apiClient.post("/posts", {
      ...createForm.value,
      tags: Array.from(tags.value),
    });

    console.log(newPost);

    posts.value.push(newPost);

    createForm.value = {
      title: "",
      content: "",
    };
    tags = new Set();
  } catch (error) {
    errors.value = error.response.data.message;
  }
};

const handleDelete = async (postId) => {
  try {
    await apiClient.get("/sanctum/csrf-cookie");
    await apiClient.delete(`/posts/${postId}`);
    posts.value = posts.value.filter((post) => post.id !== postId);
  } catch (error) {
    errors.value = error.response.data.message;
  }
};

const handleUpdate = async (post) => {
  try {
    await apiClient.get("/sanctum/csrf-cookie");

    const updatedPost = await apiClient.put(`/posts/${post.id}`, {
      title: post.title,
      content: post.content,
    });

    posts.value = posts.value.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    originalPost.value = null;
  } catch (error) {
    errors.value = error.response?.data?.message;
  }
};

apiClient
  .get("/posts")
  .then((response) => {
    posts.value = response.data.map((post) => ({
      ...post,
      tags: post.tags.map((tag) => tag.name),
    }));
  })
  .catch((error) => (errors.value = error.response.data.message));
</script>
