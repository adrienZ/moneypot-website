<script lang="ts" setup>
definePageMeta({
  middleware: ["unlogged-middleware"]
});

const route = useRoute();
const email = ref(route.query.email?.toString() ?? "");

const error = ref<string | null>(null);
const avatar = ref("");
async function signup(e: Event) {
  const result = await useFetch("/api/signup", {
    method: "POST",
    body: new FormData(e.target as HTMLFormElement)
  });

  if (result.error.value) {
    error.value =
      result.error.value.data?.message ?? result.error.value.message;
  } else {
    await navigateTo("/");
  }
}
</script>

<template>
  <UiContainer size="xs">
    <UCard class="my-10">
      <h1 class="title-1">Create an account</h1>

      <form
        class="mt-4"
        method="post"
        action="/api/signup"
        @submit.prevent="signup"
      >
        <UFormGroup label="Avatar">
          <UiUploadableAvatar name="avatar" :image-src="avatar" />
        </UFormGroup>

        <UFormGroup class="mt-2" label="email">
          <UInput id="email" v-model="email" name="email" />
        </UFormGroup>
        <UFormGroup class="mt-2" label="password">
          <UInput id="password" type="password" name="password" />
        </UFormGroup>

        <UButton class="mt-4" type="submit">Submit</UButton>
      </form>
      <UAlert
        v-if="error"
        class="mt-2"
        color="red"
        variant="soft"
        :title="error"
      ></UAlert>

      <UDivider class="my-4" label="OR" />

      <div class="mt-4">
        <AuthGithubButton />
        <AuthDiscordButton class="mt-2" />
      </div>

      <UDivider class="my-4" label="OR" />

      <div class="mt-4">
        <NuxtLink
          :to="{
            path: '/login',
            query: {
              email
            }
          }"
          class="text-primary"
          >Sign in</NuxtLink
        >
      </div>
    </UCard>
  </UiContainer>
</template>
