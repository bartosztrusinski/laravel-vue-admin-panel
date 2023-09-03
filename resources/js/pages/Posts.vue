<template>
  <Layout>
    <h1 class="text-4xl font-semibold px-5 py-3 text-center sm:text-start">
      <font-awesome-icon icon="fa-solid fa-message" />
      Posts
    </h1>

    <form
      @submit.prevent="handleCreate"
      class="flex flex-col gap-1 shadow-sm bg-white rounded-lg sm:mx-5 p-5 lg:w-[20rem] lg:fixed lg:top-[17rem] lg:left-4 border-2 border-gray-200 my-4 lg:m-0 lg:border-none"
    >
      <h2 class="text-xl text-center font-semibold">Add new post</h2>
      <label>
        <div class="first-letter:uppercase">Title</div>
        <input
          type="text"
          placeholder="Enter title"
          v-model="createForm.title"
          class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
        />
      </label>
      <label>
        <div class="first-letter:uppercase">Content</div>
        <textarea
          v-model="createForm.content"
          placeholder="Enter content"
          class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
        ></textarea>
      </label>
      <div class="relative">
        <label>
          <div class="first-letter:uppercase">tags</div>
          <input
            type="text"
            placeholder="Enter tag"
            class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
            v-model="tag"
          />
        </label>

        <button
          type="button"
          @click="handleAddTag"
          class="bg-blue-400 text-white px-2 py-1 ml-1 rounded-e absolute right-0 bottom-0 h-9"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>

      <ul v-if="tags.size > 0" class="flex flex-row flex-wrap gap-1 mt-1">
        <li
          v-for="tag in tags"
          :key="tag"
          class="rounded-full text-white px-2 py-1 font-light text-xs bg-blue-400"
        >
          #{{ tag }}
          <button
            type="button"
            class="bg-blue-500 rounded-full px-1"
            @click="handleDeleteTag(tag)"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </li>
      </ul>
      <ErrorList :errors="createErrors" />

      <button
        type="submit"
        class="bg-emerald-500 rounded text-white p-2 mt-2 place-self-end font-semibold"
      >
        <font-awesome-icon icon="fa-solid fa-plus" /> Create
      </button>
    </form>

    <ul
      v-if="posts.length > 0"
      class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:p-5"
    >
      <li v-for="post in posts" :key="post.id">
        <div
          v-if="originalPostId !== post.id"
          class="p-3 rounded-lg shadow-sm border-2 border-solid border-gray-200 bg-white break-words"
        >
          <h2 class="text-xl font-medium first-letter:uppercase">
            {{ post.title }}
          </h2>

          <div class="my-2">{{ post.content }}</div>

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

          <div
            class="flex flex-col sm:flex-row gap-2 justify-between items-end mt-2"
          >
            <div class="text-gray-500 text-sm">
              {{
                new Date(post.created_at).toLocaleString(
                  {},
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }
                )
              }}
            </div>
            <div>
              <button
                @click="handleEdit(post.id)"
                class="p-2 mr-1 bg-amber-500 text-white rounded font-semibold"
              >
                <font-awesome-icon icon="fa-solid fa-pencil" />
                Edit
              </button>
              <button
                @click="handleDelete(post.id)"
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
            @submit.prevent="handleUpdate(post)"
            class="flex flex-col gap-2"
          >
            <label>
              <div class="first-letter:uppercase">Title</div>
              <input
                type="text"
                placeholder="Enter title"
                v-model="editForm.title"
                class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
              />
            </label>
            <label>
              <div class="first-letter:uppercase">Content</div>
              <textarea
                v-model="editForm.content"
                placeholder="Enter content"
                class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
              ></textarea>
            </label>
            <div class="relative">
              <label>
                <div class="first-letter:uppercase">tags</div>
                <input
                  type="text"
                  placeholder="Enter tag"
                  class="w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
                  v-model="editTag"
                />
              </label>

              <button
                type="button"
                @click="handleAddEditTag"
                class="bg-blue-400 text-white px-2 py-1 ml-1 rounded-e absolute right-0 bottom-0 h-9"
              >
                <font-awesome-icon icon="fa-solid fa-plus" />
              </button>
            </div>

            <ul
              v-if="editTags.size > 0"
              class="flex flex-row flex-wrap gap-1 pt-2"
            >
              <li
                v-for="tag in editTags"
                :key="tag"
                class="rounded-xl text-white px-1 py-1 font-light text-xs bg-blue-400 font-mono"
              >
                #{{ tag }}
                <button
                  type="button"
                  class="bg-blue-500 rounded-full px-1"
                  @click="handleDeleteEditTag(tag)"
                >
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
              </li>
            </ul>

            <ErrorList :errors="editErrors" />

            <div class="place-self-end">
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
import apiClient from "../apiClient";
import { ref } from "vue";
import ErrorList from "../components/ErrorList.vue";
import Layout from "../components/Layout.vue";

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

const handleDeleteEditTag = (tag) => {
  editTags.value.delete(tag);
};

const handleDeleteTag = (tag) => {
  tags.value.delete(tag);
};

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
    createErrors.value = error.response.data.errors;
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
    editErrors.value = error.response.data.errors;
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
    createErrors.value = error.response.data.errors;
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
  .catch((error) => (createErrors.value = error.response.data.errors));
</script>
