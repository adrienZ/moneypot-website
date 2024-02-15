<template>
  <UiContainer class="mx-auto mt-10">
    <div v-if="moneypot" class="md:flex">
      <section class="md:w-8/12">
        <AspectRatio :ratio="16 / 9">
          <NuxtImg class="h-full w-full object-cover" :src="moneypot.image" />
        </AspectRatio>
      </section>
      <section class="md:w-4/12 md:pl-8">
        <UCard>
          <template #header>
            <h1 class="text-3xl font-bold">{{ moneypot.title }}</h1>
          </template>

          <UModal v-model="shareModalOpen">
            <div class="p-4">
              <a
                target="_blank"
                class="border p-2 block"
                :href="moneypot.share.facebook"
                >share facebook</a
              >
              <a
                target="_blank"
                class="border p-2 block"
                :href="moneypot.share.twitter"
                >share twitter</a
              >
              <a
                target="_blank"
                class="border p-2 block"
                :href="moneypot.share.linkedin"
                >share linkedin</a
              >
              <a
                target="_blank"
                class="border p-2 block"
                :href="moneypot.share.mail"
                >share mail</a
              >
              <a
                target="_blank"
                class="border p-2 block"
                :href="moneypot.share.whatsapp"
                >share whatsapp</a
              >

              <UInput class="mt-8" :value="moneypot.share.raw" readonly />
            </div>
          </UModal>

          <template v-if="moneypot.creator" #footer>
            <div class="flex items-center">
              <UAvatar size="lg" :src="moneypot.creator.avatar" alt="Avatar" />
              <div class="ml-2">{{ moneypot.creator.username }}</div>
            </div>
            <UDivider class="my-4" />
            <UButton
              block
              label="Share moneypot"
              color="gray"
              @click="shareModalOpen = true"
            />
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

const shareModalOpen = ref(false);
</script>

<style></style>
