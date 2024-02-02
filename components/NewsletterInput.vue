<template>
  <div>
    <div class="container">
      <div class="mb-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-key-icon text-primary mx-auto mb-3 h-12 w-12"
        >
          <circle cx="7.5" cy="15.5" r="5.5"></circle>
          <path d="m21 2-9.6 9.6"></path>
          <path d="m15.5 7.5 3 3L22 7l-3-3"></path>
        </svg>
        <h1 class="text-3xl font-bold lg:text-4xl">Get early access</h1>
        <p class="mt-3 text-lg opacity-70">
          Be among the first to get access to supastarter.nuxt.
        </p>
      </div>
      <div class="mx-auto max-w-lg">
        <form
          method="post"
          data-action="/api/"
          ref="formRef"
          @submit.prevent="subscribeEmailToNewsletter"
        >
          <div class="flex items-end">
            <UFormGroup label="Email" class="flex-grow mr-4">
              <UInput
                id="email"
                v-model="email"
                name="email"
                :loading="request.status.value === 'pending'"
              />
            </UFormGroup>

            <UButton type="submit">Subscribe</UButton>
          </div>
        </form>

        <UAlert
          v-if="responseText"
          class="mt-3"
          :color="request.error.value ? 'red' : 'primary'"
          variant="subtle"
          :title="responseText"
        ></UAlert>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const email = ref("");
const request = await useLazyFetch("/api/email/subscribe", {
  method: "POST",
  // only submit with the form
  immediate: false,
  body: {
    email
  },
  // do not trigger on each keystroke
  watch: false
});

const responseText = computed(() => {
  if (request.status.value === "error") {
    return "error: " + request.error.value;
  }

  if (request.status.value === "success") {
    return "sucess";
  }
});

function subscribeEmailToNewsletter() {
  return request.execute();
}
</script>
