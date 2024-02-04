<template>
  <UContainer class="mx-auto">
    <div v-if="moneypot" class="flex">
      <section class="w-3/4">
        <AspectRatio :ratio="16 / 9">
          <NuxtImg class="h-full w-full object-cover" :src="moneypot.image" />
        </AspectRatio>
      </section>
      <section class="w-1/4">
        <UCard class="ml-8">
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
  </UContainer>
</template>

<script lang="ts" setup>
import { AspectRatio } from "radix-vue";
import type { User } from "~/server/database/schema";
import type { Moneypot } from "~/server/database/schema/types";

const route = useRoute("moneypot-moneypotId");

const { data: moneypot } = await useAsyncData(
  `moneypot-${route.params.moneypotId}`,
  () =>
    $fetch<Moneypot & { creator: User }>(
      "/api/moneypot/" + route.params.moneypotId
    )
);
</script>

<style></style>
