<template>
  <UiContainer class="mx-auto my-10" size="xs">
    <UAlert
      class="mb-8"
      title="Fake data"
      icon="i-heroicons-command-line"
      color="teal"
      variant="subtle"
      description="Set the amount you wish, the payment will use a test card from Stripe"
    ></UAlert>

    <h1 class="text-2xl font-bold">Contribute to: {{ moneypot?.title }}</h1>

    <form class="mt-8" ref="formRef" @submit.prevent="contribute">
      <UFormGroup label="Amount in €">
        <UInput type="number" name="amount" size="xl" autofocus />
      </UFormGroup>

      <UFormGroup class="mt-4" label="Card number">
        <UInput
          type="string"
          name="cardNumber"
          value="4242424242424242"
          readonly
          disabled
        />
      </UFormGroup>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <UFormGroup label="Expiration date">
          <UInput
            type="date"
            name="expirationDAte"
            :value="
              new Date(Date.now() + 99999999999).toISOString().split('T')[0]
            "
            readonly
            disabled
          />
        </UFormGroup>
        <UFormGroup label="CCV">
          <UInput type="string" name="ccv" value="123" readonly disabled />
        </UFormGroup>
      </div>
      <UButton block class="mt-4" size="xl" type="submit">Contribute !</UButton>
    </form>
    <UAlert
      v-if="responseText"
      class="mt-4"
      :color="request.error.value ? 'red' : 'primary'"
      variant="subtle"
      :title="responseText"
    />
  </UiContainer>
</template>

<script setup lang="ts">
import type { MoneypotState } from "~/models/MoneypotState";

definePageMeta({
  middleware: ["protected-middleware"]
});

const route = useRoute("moneypot-moneypotId-contribute");
const { data: moneypot } = await useAsyncData(
  `moneypot-${route.params.moneypotId}`,
  () =>
    $fetch<MoneypotState["data"]>("/api/moneypot/" + route.params.moneypotId)
);

const formRef = ref<HTMLFormElement>();
const { data: formData } = useFormData(formRef);

const request = await useLazyFetch(
  "/api/contribute/" + moneypot.value?.externalId,
  {
    method: "POST",
    // only submit with the form
    immediate: false,
    body: formData,

    // do not trigger on each keystroke
    watch: false
  }
);

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

async function contribute() {
  await request.execute();

  if (request.status.value === "success") {
    // navigateTo("/");
  }
}
</script>
