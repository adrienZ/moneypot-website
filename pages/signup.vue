<script lang="ts" setup>
definePageMeta({
  middleware: ["unlogged-middleware"]
});

const error = ref<string | null>(null);

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
  <div>
    <h1>Create an account</h1>
    <form method="post" action="/api/signup" @submit.prevent="signup">
      <UFormGroup label="email">
        <UInput id="email " name="email" />
      </UFormGroup>
      <UFormGroup label="password">
        <UInput id="password" type="password" name="password" />
      </UFormGroup>

      <UButton type="submit">Submit</UButton>
    </form>

    <NuxtLink to="/login">Sign in</NuxtLink>
  </div>
</template>
