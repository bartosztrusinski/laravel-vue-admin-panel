<template>
  <Layout>
    <h1 class="text-4xl font-semibold px-5 py-3 text-center sm:text-start">
      <font-awesome-icon icon="fa-solid fa-message" />
      Posts
    </h1>

    <div
      class="shadow-sm bg-white rounded-lg sm:mx-5 p-5 lg:w-[20rem] lg:fixed lg:top-[17rem] lg:left-4 border-2 border-gray-200 my-4 lg:m-0 lg:border-none"
    >
      <h2 class="text-xl text-center font-semibold">Add new post</h2>
      <PostForm :handleSubmit="handleCreate">
        <Button
          type="submit"
          icon="fa-solid fa-plus"
          class="place-self-end mt-2 bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-600"
        >
          Create
        </Button>
      </PostForm>
    </div>

    <ul
      v-if="posts.length > 0"
      class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:p-5"
    >
      <li v-for="post in posts" :key="post.id">
        <div
          class="p-3 rounded-lg shadow-sm border-2 border-solid border-gray-200 bg-white break-words"
        >
          <div v-if="editedPostId !== post.id">
            <h2 class="text-xl font-medium first-letter:uppercase">
              {{ post.title }}
            </h2>
            <div class="my-2">{{ post.content }}</div>
            <TagList :tags="post.tags" />
            <div
              class="flex flex-col sm:flex-row gap-2 justify-between items-end mt-2"
            >
              <time class="text-gray-500 text-sm">
                {{ formatDate(post.created_at) }}
              </time>
              <div>
                <Button
                  @click="handleEdit(post.id)"
                  icon="fa-solid fa-pencil"
                  class="mr-1 bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-700"
                >
                  Edit
                </Button>
                <Button
                  @click="handleDelete(post.id)"
                  icon="fa-solid fa-trash-can"
                  class="bg-red-400 hover:bg-red-500 focus-visible:ring-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <PostForm v-else :handleSubmit="handleUpdate" :post="post">
            <div class="place-self-end">
              <Button
                type="submit"
                class="mr-1 bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-700"
                icon="fa-solid fa-check"
              >
                Update
              </Button>
              <Button
                @click="handleCancel"
                class="bg-red-400 hover:bg-red-500 focus-visible:ring-red-600"
                icon="fa-solid fa-xmark"
              >
                Cancel
              </Button>
            </div>
          </PostForm>
        </div>
      </li>
    </ul>
  </Layout>
</template>
<script setup>
import apiClient from "../apiClient";
import { ref } from "vue";
import Layout from "../components/Layout.vue";
import PostForm from "../components/PostForm.vue";
import Button from "../components/Button.vue";
import TagList from "../components/TagList.vue";

const posts = ref([]);
const editedPostId = ref(null);

const formatDate = (strDate) =>
  new Date(strDate).toLocaleString(
    {},
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  );

const handleCancel = () => {
  editedPostId.value = null;
};

const handleCreate = async (form, tags) => {
  try {
    const { data: newPost } = await apiClient.post("/posts", {
      ...form,
      tags: Array.from(tags),
    });

    posts.value.push(newPost);
  } catch (error) {
    throw error;
  }
};

const handleUpdate = async (form, tags, postId) => {
  try {
    const { data: updatedPost } = await apiClient.put(`/posts/${postId}`, {
      ...form,
      tags: Array.from(tags),
    });

    editedPostId.value = null;
    posts.value = posts.value.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
  } catch (error) {
    throw error;
  }
};

const handleEdit = (postId) => {
  editedPostId.value = postId;
};

const handleDelete = async (postId) => {
  try {
    await apiClient.delete(`/posts/${postId}`);
    posts.value = posts.value.filter((post) => post.id !== postId);
  } catch (error) {
    console.log(error);
  }
};

apiClient
  .get("/posts")
  .then((response) => {
    posts.value = response.data.map((post) => ({
      ...post,
      tags: new Set(post.tags.map((tag) => tag.name)),
    }));
  })
  .catch((error) => console.log(error));
</script>
