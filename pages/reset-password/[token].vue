<script lang="ts" setup>
const errorMessage = ref<string | null>(null);

const route = useRoute("reset-password-token");
const apiRoute = `/api/reset-password/${route.params.token}`;

const handleSubmit = async (e: Event) => {
  if (!(e.target instanceof HTMLFormElement)) return;
  errorMessage.value = null;
  const formData = new FormData(e.target);
  try {
    await $fetch(apiRoute, {
      method: "POST",
      body: {
        password: formData.get("password")
      }
    });
    await navigateTo("/");
  } catch (e) {
    const { data: error } = e as {
      data: {
        message: string;
      };
    };
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div>
    <h1>Reset password</h1>
    <form method="post" :action="apiRoute" @submit.prevent="handleSubmit">
      <label htmlFor="password">New Password</label>
      <input id="password" name="password" />
      <br />
      <input type="submit" />
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>
