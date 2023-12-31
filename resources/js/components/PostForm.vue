<template>
  <form @submit.prevent="submitForm" class="flex flex-col gap-1">
    <label>
      Title
      <input
        type="text"
        placeholder="Enter title"
        v-model="form.title"
        required
        class="appearance-none w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
      />
    </label>
    <label>
      Content
      <textarea
        v-model="form.content"
        placeholder="Enter content"
        required
        class="appearance-none w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
      ></textarea>
    </label>
    <div class="relative">
      <label>
        Tags
        <input
          type="text"
          placeholder="Enter tag"
          class="appearance-none w-full p-1 outline-none border-2 border-gray-200 rounded focus-visible:outline-none focus-visible:border-blue-400"
          v-model="tag"
        />
      </label>

      <Button
        @click="handleAddTag"
        icon="fa-solid fa-plus"
        class="bg-blue-400 hover:bg-blue-500 focus-visible:ring-blue-500 px-2 py-1 ml-1 rounded-none rounded-e absolute right-0 bottom-0 h-9"
      >
        <span class="sr-only">Add tag</span>
      </Button>
    </div>

    <TagList :tags="tags" class="mt-1" :editable="true" />
    <ErrorList :errors="errors" />

    <slot />
  </form>
</template>
<script setup>
import ErrorList from "../components/ErrorList.vue";
import TagList from "./TagList.vue";
import Button from "./Button.vue";
import { ref } from "vue";

const { handleSubmit, post } = defineProps(["handleSubmit", "post"]);

const errors = ref();
const tags = ref(new Set(post?.tags ?? []));
const tag = ref("");
const form = ref(
  post
    ? { ...post }
    : {
        title: "",
        content: "",
      }
);

const handleAddTag = () => {
  if (tag.value.length === 0 || tag.value.length > 20) {
    errors.value = "Tag must be between 1 and 20 characters";
    return;
  }

  if (!tag.value.match(/^[a-zA-Z0-9_]+$/)) {
    errors.value = "Tag must only contain letters, numbers, and underscores";
    return;
  }

  tags.value.add(tag.value);
  tag.value = "";
  errors.value = "";
};

const submitForm = async () => {
  try {
    await handleSubmit(form.value, tags.value, post?.id);
    tags.value = new Set();
    tag.value = "";
    errors.value = "";
    form.value = {
      title: "",
      content: "",
    };
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors);
    } else {
      errors.value = error.response?.data?.message ?? error.message;
    }
  }
};
</script>
