<script lang="ts" setup>
import { AspectRatio } from "radix-vue";

const { data: categories } = await useAsyncData("moneypot-categories", () =>
  $fetch("/api/moneypot-categories")
);
</script>

<template>
  <section>
    <div class="flex flex-wrap gap-y-10 -mx-10">
      <div
        v-for="category in categories"
        :key="category.externalId"
        class="w-1/6 mx-4"
      >
        <NuxtLink
          :to="{
            path: '/',
            query: {
              cat: category.value
            }
          }"
        >
          <UCard>
            <template #footer>{{ category.value }}</template>
            <AspectRatio :ratio="4 / 3">
              <NuxtImg
                class="h-full w-full object-cover"
                :alt="category.value"
                :src="category.image"
              />
            </AspectRatio>
          </UCard>
        </NuxtLink>
      </div>
    </div>

    <UDivider class="my-20"></UDivider>

    <NewsletterInput />
  </section>
</template>
