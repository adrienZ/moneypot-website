<script lang="ts" setup>
import { AspectRatio } from "radix-vue";

const { data: categories } = await useAsyncData("moneypot-categories", () =>
  $fetch("/api/moneypot-categories")
);

const { data: moneypots } = await useAsyncData("last-moneypots", () =>
  $fetch("/api/moneypots", {
    params: {
      limit: 4
    }
  })
);
</script>

<template>
  <UiContainer as="main">
    <section>
      <h2 class="text-3xl font-bold mb-4">Create your own moneypot</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
        <div v-for="category in categories" :key="category.externalId">
          <NuxtLink
            :to="{
              path: '/create-moneypot',
              query: {
                categoryId: category.externalId
              }
            }"
          >
            <UCard
              :ui="{
                strategy: 'override',
                body: {
                  padding: 'p-0'
                }
              }"
            >
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
    </section>

    <UDivider class="my-10" />

    <section v-if="moneypots?.length">
      <h2 class="text-3xl font-bold mb-4">Last moneypots</h2>
      <div class="grid grid-cols-4 gap-10">
        <div v-for="moneypot in moneypots" :key="moneypot.externalId">
          <NuxtLink
            :to="{
              name: 'moneypot-moneypotId',
              params: {
                moneypotId: moneypot.externalId
              }
            }"
          >
            <UCard
              :ui="{
                strategy: 'override',
                body: {
                  padding: 'p-0'
                }
              }"
            >
              <template #footer>{{ moneypot.title }}</template>
              <AspectRatio v-if="moneypot.image" :ratio="4 / 3">
                <NuxtImg
                  class="h-full w-full object-cover"
                  :alt="moneypot.image"
                  :src="moneypot.image"
                />
              </AspectRatio>
            </UCard>
          </NuxtLink>
        </div>
      </div>
    </section>

    <UDivider class="my-10"></UDivider>

    <NewsletterInput class="mb-10" />
  </UiContainer>
</template>
