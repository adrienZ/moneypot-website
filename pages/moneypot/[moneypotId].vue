<template>
  <UiContainer class="mx-auto">
    <div v-if="moneypot" class="md:flex">
      <section class="md:w-3/4">
        <AspectRatio :ratio="16 / 9">
          <NuxtImg class="h-full w-full object-cover" :src="moneypot.image" />
        </AspectRatio>
      </section>
      <section class="md:w-1/4 md:pl-8">
        <UCard>
          <template #header>
            <h1 class="text-3xl font-bold">{{ moneypot.title }}</h1>
          </template>

          <p>{{ moneypot.description }}</p>

          <template v-if="moneypot.creator" #footer>
            <div class="flex items-center">
              <UAvatar size="lg" :src="moneypot.creator.avatar" alt="Avatar" />
              <div class="ml-2">{{ moneypot.creator.username }}</div>
            </div>
            <UDivider class="my-4" />
            <div class="underline">{{ moneypot.creator.externalId }}</div>
          </template>
        </UCard>
      </section>
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
import { AspectRatio } from "radix-vue";
import type { MoneypotState } from "~/models/MoneypotState";

const route = useRoute("moneypot-moneypotId");

const { data: moneypot } = await useAsyncData(
  `moneypot-${route.params.moneypotId}`,
  () =>
    $fetch<MoneypotState["data"]>("/api/moneypot/" + route.params.moneypotId)
);
</script>

<style></style>
