<template>
  <div>
    <div class="container mx-auto">
      <div class="mx-auto max-w-lg">
        <form method="post" @submit.prevent="subscribeEmailToNewsletter">
          <div class="flex items-end">
            <UFormGroup label="Code" class="flex-grow mr-4">
              <UInput
                id="code"
                v-model="code"
                name="code"
                :loading="request.status.value === 'pending'"
              />
            </UFormGroup>

            <UButton type="submit">Send</UButton>
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
const code = ref("");
const request = await useLazyFetch("/api/email-verification/:code", {
  method: "POST",
  // only submit with the form
  immediate: false,
  body: {
    code
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

async function subscribeEmailToNewsletter() {
  await request.execute();

  if (request.status.value === "success") {
    navigateTo("/settings");
  }
}
</script>
