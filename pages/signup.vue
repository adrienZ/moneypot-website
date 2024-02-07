<script lang="ts" setup>
definePageMeta({
  middleware: ["unlogged-middleware"]
});

const error = ref<string | null>(null);
const avatar = ref("");
async function signup(e: Event) {
  const result = await useFetch("/api/signup", {
    method: "POST",
    body: new FormData(e.target as HTMLFormElement)
  });
  if (result.error.value) {
    error.value = result.error.value.data?.message ?? null;
  } else {
    await navigateTo("/");
  }
}
</script>

<template>
  <UiContainer>
    <h1 class="text-2xl font-bold">Create an account</h1>
    <form
      class="mt-4"
      method="post"
      action="/api/signup"
      @submit.prevent="signup"
    >
      <UFormGroup label="Avatar">
        <UiUploadableAvatar name="avatar" :image-src="avatar" />
      </UFormGroup>

      <UFormGroup class="mt-4" label="email">
        <UInput id="email " name="email" />
      </UFormGroup>
      <UFormGroup class="mt-4" label="password">
        <UInput id="password" type="password" name="password" />
      </UFormGroup>

      <UButton class="mt-4" type="submit">Submit</UButton>
    </form>

    <div class="mt-4">
      <NuxtLink to="/login">Sign in</NuxtLink>
    </div>
  </UiContainer>
</template>
