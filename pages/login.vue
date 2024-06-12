<script lang="ts" setup>
definePageMeta({
  middleware: ["unlogged-middleware"]
});

const route = useRoute();
const email = ref(route.query.email?.toString() ?? "");
const error = ref<string | null>(null);

const formRef = ref<HTMLFormElement>();
const { data: formData } = useFormData(formRef);
const result = await useFetch("/api/login", {
  method: "POST",
  body: formData,
  immediate: false
});

async function login() {
  await result.execute();
  if (result.error.value) {
    result.error.value.data?.message ?? result.error.value.message;
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
        ref="formRef"
        method="post"
        action="/api/login"
        class="mt-4"
        @submit.prevent="login"
      >
        <UFormGroup label="Email">
          <UInput id="email" v-model="email" name="email" />
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
        <AuthLinkedinButton class="mt-2" />
      </div>

      <UDivider class="my-4" label="OR" />

      <p class="text-sm">
        Don't have an account?
        <br />
        <NuxtLink
          :to="{
            path: '/signup',
            query: {
              email
            }
          }"
          class="text-primary"
        >
          Sign up
        </NuxtLink>
        <br />
        <NuxtLink to="/reset-password" class="text-primary">
          forgotten password
        </NuxtLink>
      </p>
    </UCard>
  </UiContainer>
</template>
