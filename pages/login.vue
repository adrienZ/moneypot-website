<script lang="ts" setup>
definePageMeta({
  middleware: ["unlogged-middleware"]
});

const error = ref<string | null>(null);

const formRef = ref<HTMLFormElement>();
const { data: formData } = useFormData(formRef);

async function login() {
  const result = await useFetch("/api/login", {
    method: "POST",
    body: formData
  });
  if (result.error.value) {
    error.value = result.error.value.data?.message ?? null;
  } else {
    await navigateTo(result.data.value?.redirect);
  }
}
</script>

<template>
  <UCard>
    <h1>Sign in</h1>
    <UButton
      block
      variant="solid"
      color="white"
      external
      to="/api/login/github"
    >
      <UIcon name="i-logos-github-icon" class="h-6 w-6 m-1" /> Sign in with
      Github
    </UButton>

    <UButton
      block
      variant="solid"
      color="white"
      external
      to="/api/login/discord"
    >
      <UIcon name="i-logos-discord-icon" class="h-6 w-6 m-1" /> Sign in with
      Discord
    </UButton>

    <UDivider class="my-4" label="OR" />

    <form
      method="post"
      action="/api/login"
      ref="formRef"
      @submit.prevent="login"
    >
      <UFormGroup label="Email">
        <UInput id="email" name="email" />
      </UFormGroup>
      <UFormGroup label="Password">
        <UInput id="password" type="password" name="password" />
      </UFormGroup>

      <UButton type="submit">Submit</UButton>
    </form>

    <UAlert v-if="error" color="red" variant="soft" :title="error"></UAlert>

    <p class="text-sm mt-4">
      Don't have an account?
      <br />
      <NuxtLink to="/signup" class="text-primary"> Sign up </NuxtLink>
      <br />
      <NuxtLink to="/reset-password" class="text-primary">
        forgotten password
      </NuxtLink>
    </p>
  </UCard>
</template>
