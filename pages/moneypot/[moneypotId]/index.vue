<template>
  <UiContainer class="mx-auto my-10">
    <div v-if="moneypot">
      <div class="md:flex">
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

            <div v-if="moneypot.targetAmount">
              <div>
                {{ moneypotAmount }}
                {{ getCurrencySymbol(undefined, moneypot.currency) }} of
                {{ moneypot.targetAmount }}
                {{ getCurrencySymbol(undefined, moneypot.currency) }}
              </div>
              <UProgress
                class="mt-2"
                :value="100 * (moneypotAmount / moneypot.targetAmount)"
              />
            </div>

            <div class="mt-4">{{ contributorsCount }} Contributors</div>

            <UButton
              block
              size="xl"
              class="mt-6"
              :to="`/moneypot/${moneypot.externalId}/contribute`"
              >Contribute</UButton
            >

            <template v-if="moneypot.creator" #footer>
              <div class="flex items-center">
                <UAvatar
                  size="lg"
                  :src="moneypot.creator.avatar"
                  alt="Avatar"
                />
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
      </div>

      <UCard class="md:w-8/12 mt-10">
        {{ moneypot.description }}
      </UCard>
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

function getCurrencySymbol(locale = undefined, currency: string) {
  return (0)
    .toLocaleString(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    .replace(/\d/g, "")
    .trim();
}
const moneypotAmount = ref(0);
const contributorsCount = ref(0);
</script>

<style></style>
