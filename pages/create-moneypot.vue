<template>
  <UiContainer as="main" size="xs" class="my-10">
    <form ref="formRef" @submit.prevent="createMoneyPot">
      <h3 class="font-bold text-xl mb-4">Choose category</h3>
      <USelectMenu
        v-if="categories"
        v-model="activeCategory"
        :options="categories"
        @update:model-value="setActiveCategory"
      >
        <template #label>
          <div v-if="activeCategory" class="flex items-center">
            <div class="h-44 w-44">
              <AspectRatio :ratio="1 / 1">
                <NuxtImg
                  class="h-full w-full object-cover"
                  :alt="activeCategory.value"
                  :src="activeCategory.image"
                />
              </AspectRatio>
            </div>
            <div class="ml-4">{{ activeCategory.value }}</div>
          </div>
          <span v-else class="opacity-50">Category</span>
        </template>
        <template #option="{ option: item }">
          <div class="flex items-center">
            <div class="h-16 w-16">
              <AspectRatio :ratio="1 / 1">
                <NuxtImg
                  class="h-full w-full object-cover"
                  :alt="item.value"
                  :src="item.image"
                />
              </AspectRatio>
            </div>
            <div class="ml-4">{{ item.value }}</div>
          </div>
        </template>
      </USelectMenu>

      <UDivider class="my-4" label="Create your moneypot"></UDivider>

      <input
        id="categoryId"
        type="hidden"
        name="categoryId"
        :value="activeCategory?.externalId"
      />

      <UFormGroup label="Title">
        <UInput id="title" type="string" name="title" />
      </UFormGroup>

      <UFormGroup label="Description" class="mt-4">
        <UTextarea
          id="description"
          v-model="value"
          name="description"
          color="white"
          variant="outline"
        />
        <Editor
          v-show="false"
          v-model="value"
          placeholder="Your story..."
          editor-style="height: 320px"
        />
      </UFormGroup>
      <UButton type="submit" class="mt-2">Create</UButton>
    </form>
    <UAlert
      v-if="responseText"
      class="mt-3"
      :color="request.error.value ? 'red' : 'primary'"
      variant="subtle"
      :title="responseText"
    />
  </UiContainer>
</template>

<script lang="ts" setup>
import { AspectRatio } from "radix-vue";
import type { MoneyPotCategory } from "~/server/database/schema/types";
import Editor from "primevue/editor";

definePageMeta({
  middleware: ["protected-middleware"]
});

const route = useRoute();
const activeCategory = ref<MoneyPotCategory>();

const { data: categories } = await useAsyncData("moneypot-categories", () =>
  // TODO: try to auto infer type with $fetch
  $fetch<MoneyPotCategory[]>("/api/moneypot-categories")
);

const categoryFromRoutQuery = categories.value?.find(
  (category) => category.externalId === route.query.categoryId
);

const value = ref("");

const formRef = ref<HTMLFormElement>();
const { data: formData, update } = useFormData(formRef);

onMounted(() => {
  if (categoryFromRoutQuery) {
    setActiveCategory(categoryFromRoutQuery);
  }
});

function setActiveCategory(item: MoneyPotCategory) {
  activeCategory.value = item;
  console.log(item);

  update();
}

const request = await useLazyFetch("/api/moneypot/create", {
  method: "POST",
  // only submit with the form
  immediate: false,
  body: formData,

  // do not trigger on each keystroke
  watch: false
});

const responseText = computed(() => {
  if (request.status.value === "error") {
    return (
      request.error.value?.data?.message ||
      request.error.value?.message ||
      String(request.error.value)
    );
  }

  if (request.status.value === "success") {
    return "sucess";
  }
});

async function createMoneyPot() {
  await request.execute();

  if (request.status.value === "success") {
    navigateTo("/");
  }
}
</script>

<style></style>
