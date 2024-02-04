<template>
  <main class="container mx-auto">
    <h3 class="font-bold text-xl mb-4">Choose category</h3>
    <div class="flex flex-wrap gap-y-10 gap-x-6">
      <div
        v-for="category in categories"
        :key="category.externalId"
        class="w-1/7"
      >
        <button class="block w-full" @click="setActiveCategory(category)">
          <UCard
            :ui="{
              strategy: 'override',
              body: {
                padding: 'p-0'
              },
              footer: {
                background:
                  category.id === activeCategory?.id ? 'bg-green-400' : ''
              }
            }"
          >
            <template #footer>
              <div>
                {{ category.value }}
              </div>
            </template>
            <AspectRatio :ratio="4 / 3">
              <NuxtImg
                class="h-full w-full object-cover"
                :alt="category.value"
                :src="category.image"
              />
            </AspectRatio>
          </UCard>
        </button>
      </div>
    </div>

    <UDivider class="my-4" label="Create your moneypot"></UDivider>

    <form ref="formRef" @submit.prevent="createMoneyPot">
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
          name="description"
          color="white"
          variant="outline"
          placeholder="Your story..."
        />

        <UButton type="submit" class="mt-2">Create</UButton>
      </UFormGroup>
    </form>
    <UAlert
      v-if="responseText"
      class="mt-3"
      :color="request.error.value ? 'red' : 'primary'"
      variant="subtle"
      :title="responseText"
    />
  </main>
</template>

<script lang="ts" setup>
import { AspectRatio } from "radix-vue";
import type { MoneyPotCategory } from "~/server/database/schema/types";

definePageMeta({
  middleware: ["protected-middleware"]
});

const route = useRoute();
const activeCategory = ref<MoneyPotCategory>();

const { data: categories } = await useAsyncData("moneypot-categories", () =>
  $fetch("/api/moneypot-categories")
);

const categoryFromRoutQuery = categories.value?.find(
  (category) => category.externalId === route.query.categoryId
);
if (categoryFromRoutQuery) {
  activeCategory.value = categoryFromRoutQuery;
}

const formRef = ref<HTMLFormElement>();
const { data: formData, update } = useFormData(formRef);

function setActiveCategory(item: MoneyPotCategory) {
  activeCategory.value = item;
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