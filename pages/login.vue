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
  <UiContainer size="xs" class="my-auto">
    <UCard class="my-10">
      <h1 class="title-1">Sign in</h1>

      <form
        method="post"
        action="/api/login"
        class="mt-4"
        ref="formRef"
        @submit.prevent="login"
      >
        <UFormGroup label="Email">
          <UInput id="email" name="email" />
        </UFormGroup>
        <UFormGroup class="mt-2" label="Password">
          <UInput id="password" type="password" name="password" />
        </UFormGroup>

        <UButton class="mt-2" type="submit">Submit</UButton>
      </form>

      <UAlert v-if="error" color="red" variant="soft" :title="error"></UAlert>

      <UDivider class="my-4" label="OR" />

      <div class="mt-4">
        <AuthGithubButton />
        <AuthDiscordButton class="mt-2" />
      </div>

      <UDivider class="my-4" label="OR" />

      <p class="text-sm">
        Don't have an account?
        <br />
        <NuxtLink to="/signup" class="text-primary"> Sign up </NuxtLink>
        <br />
        <NuxtLink to="/reset-password" class="text-primary">
          forgotten password
        </NuxtLink>
      </p>
    </UCard>
  </UiContainer>
</template>
