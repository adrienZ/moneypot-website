<script lang="ts" setup>
definePageMeta({
  middleware: ["unlogged-middleware"]
});

const error = ref<string | null>(null);

async function login(e: Event) {
  const result = await useFetch("/api/login", {
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
  <h1>Sign in</h1>
  <form method="post" action="/api/login" @submit.prevent="login">
    <label for="email">email</label>
    <input id="email" name="email" />
    <br />
    <label for="password">Password</label>
    <input id="password" type="password" name="password" />
    <br />
    <input type="submit" />
  </form>
  <p>{{ error }}</p>

  <div data-oauth>
    <a href="/api/login/github">Sign in with GitHub</a>
  </div>

  <div data-oauth>
    <a href="/api/login/discord">Sign in with Discord</a>
  </div>

  <div>
    <NuxtLink to="/signup">Create an account</NuxtLink>
  </div>

  <div>
    <NuxtLink to="/reset-password">forgotten password ?</NuxtLink>
  </div>
</template>
