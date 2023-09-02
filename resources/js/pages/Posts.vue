<template>
  <div class="bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-semibold p-2">Posts</h1>

    <h2 class="text-xl text-center">Create Post</h2>
    <form
      @submit.prevent="handleCreate"
      class="flex flex-col gap-1 flex-grow max-w-[20rem] m-auto shadow-xl rounded px-6 py-3 bg-white"
    >
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

      <ul v-if="tags.size > 0" class="flex flex-row flex-wrap gap-1 pt-2">
        <li
          v-for="tag in tags"
          :key="tag"
          class="rounded-xl text-white px-2 py-1 font-light text-xs bg-blue-400"
        >
          #{{ tag }}
        </li>
      </ul>

      <ul
        class="text-red-400 text-sm"
        v-for="(value, index) in createErrors"
        :key="index"
        v-if="typeof createErrors === 'object'"
      >
        <li class="list-none">{{ value[index] }}</li>
      </ul>
      <p class="text-red-400 text-sm" v-if="typeof createErrors === 'string'">
        {{ createErrors }}
      </p>

      <button
        type="submit"
        class="bg-blue-400 rounded text-white px-2 py-1 mb-3 place-self-end font-semibold"
      >
        Create
      </button>
    </form>

    <ul
      v-if="posts.length > 0"
      class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-sm m-auto sm:max-w-none"
    >
      <li v-for="post in posts" :key="post.id">
        <div
          v-if="originalPostId !== post.id"
          class="flex flex-col place-content-around min-h-full p-5 rounded-lg shadow-lg bg-white"
        >
          <h2 class="text-xl font-semibold first-letter:uppercase">
            {{ post.title }}
          </h2>
          <div>{{ post.content }}</div>
          <div class="text-teal-500 font-light p-1 rounded-lg">
            {{ new Date(post.created_at).toLocaleString() }}
          </div>

          <ul
            v-if="post.tags.length > 0"
            class="flex flex-row flex-wrap gap-1 py-1"
          >
            <li
              v-for="tag in post.tags"
              :key="tag"
              class="rounded-xl text-white px-2 font-light text-xs py-1 bg-blue-400"
            >
              #{{ tag }}
            </li>
          </ul>

          <div class="flex gap-1 justify-end mt-3">
            <button
              @click="handleEdit(post.id)"
              class="px-2 py-1 bg-emerald-500 text-white rounded font-semibold"
            >
              Edit
            </button>
            <button
              @click="handleDelete(post.id)"
              class="px-2 py-1 bg-red-400 text-white rounded font-semibold"
            >
              Delete
            </button>
          </div>
        </div>

        <div v-else class="flex flex-row gap-1">
          <form
            @submit.prevent="handleUpdate(post)"
            class="flex flex-col gap-1 flex-grow m-auto shadow-xl rounded px-6 py-3 bg-white"
          >
            <label v-for="(_, key) in editForm">
              <div class="first-letter:uppercase font-light text-lg">
                {{ key }}
              </div>
              <input
                type="text"
                v-model="editForm[key]"
                class="w-full p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
              />
            </label>

            <div>
              <label>
                <div class="first-letter:uppercase font-light text-lg">
                  tags
                </div>
                <input
                  type="text"
                  class="p-1 outline-none border-2 border-gray-300 rounded focus-visible:outline-none focus-visible:border-blue-400"
                  v-model="editTag"
                />
              </label>

              <button
                type="button"
                @click="handleAddEditTag"
                class="bg-blue-400 rounded-e text-white px-2 py-1 font-semibold"
              >
                Add Tag
              </button>
            </div>

            <ul
              v-if="editTags.size > 0"
              class="flex flex-row flex-wrap gap-1 pt-2"
            >
              <li
                v-for="tag in editTags"
                :key="tag"
                class="rounded-xl text-white px-2 py-1 font-light text-xs bg-blue-400"
              >
                #{{ tag }}
              </li>
            </ul>

            <ul
              class="text-red-400 text-sm"
              v-for="(value, index) in editErrors"
              :key="index"
              v-if="typeof editErrors === 'object'"
            >
              <li>{{ value[index] }}</li>
            </ul>
            <p
              class="text-red-400 text-sm"
              v-if="typeof editErrors === 'string'"
            >
              {{ editErrors }}
            </p>

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
import apiClient from "../apiClient";
import { ref } from "vue";

const posts = ref([]);
const originalPostId = ref(null);

const createForm = ref({
  title: "",
  content: "",
});
const createErrors = ref();
const tags = ref(new Set());
const tag = ref("");

const editForm = ref({
  title: "",
  content: "",
});
const editErrors = ref();
const editTags = ref(new Set());
const editTag = ref("");

const handleAddTag = () => {
  if (tag.value.length === 0 || tag.value.length > 20) {
    createErrors.value = "Tag must be between 1 and 20 characters";
    return;
  }

  if (!tag.value.match(/^[a-zA-Z0-9_]+$/)) {
    createErrors.value =
      "Tag must only contain letters, numbers, and underscores";
    return;
  }

  tags.value.add(tag.value);
  tag.value = "";
  createErrors.value = "";
};

const handleAddEditTag = () => {
  if (editTag.value.length === 0 || editTag.value.length > 20) {
    editErrors.value = "Tag must be between 1 and 20 characters";
    return;
  }

  if (!editTag.value.match(/^[a-zA-Z0-9_]+$/)) {
    editErrors.value =
      "Tag must only contain letters, numbers, and underscores";
    return;
  }

  editTags.value.add(editTag.value);
  editTag.value = "";
  editErrors.value = "";
};

const handleCancel = () => {
  originalPostId.value = null;
  editErrors.value = "";
};

const handleCreate = async () => {
  try {
    const { data: newPost } = await apiClient.post("/posts", {
      ...createForm.value,
      tags: Array.from(tags.value),
    });

    posts.value.push(newPost);
    tags.value = new Set();
    createForm.value = {
      title: "",
      content: "",
    };
  } catch (error) {
    createErrors.value = error.response.data.message;
  }
};

const handleUpdate = async (post) => {
  try {
    const { data: updatedPost } = await apiClient.put(`/posts/${post.id}`, {
      ...editForm.value,
      tags: Array.from(editTags.value),
    });

    originalPostId.value = null;
    editTags.value = new Set();
    editForm.value = {
      title: "",
      content: "",
    };
    posts.value = posts.value.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
  } catch (error) {
    editErrors.value = error.response?.data?.message;
  }
};

const handleEdit = (postId) => {
  const post = posts.value.find((post) => post.id === postId);

  originalPostId.value = post.id;
  editTags.value = new Set(post.tags);
  editForm.value = {
    title: post.title,
    content: post.content,
  };
};

const handleDelete = async (postId) => {
  try {
    await apiClient.delete(`/posts/${postId}`);
    posts.value = posts.value.filter((post) => post.id !== postId);
  } catch (error) {
    createErrors.value = error.response.data.message;
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
  .catch((error) => (createErrors.value = error.response.data.message));
</script>
