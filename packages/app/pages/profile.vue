<template>
  <main>
    <form v-if="profile" novalidate>
      <UFormGroup label="Username">
        <UInput readonly name="Username" :value="profile.username" />
      </UFormGroup>

      <UFormGroup label="Email">
        <UInput readonly name="Email" :value="profile.email" />
      </UFormGroup>

      <div>
        <button
          type="button"
          :disabled="status === 'pending' || status === 'success'"
          @click="resetPassword()"
        >
          reset password
        </button>
        <p v-if="status === 'success'">
          Your password reset link was sent to your inbox
        </p>
        <p v-if="status === 'error'">{{ error }}</p>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected-middleware"]
});

const user = useUser();
const { data: profile } = await useAsyncData(
  `${user.value?.externalId}-profile`,
  () => $fetch("/api/me")
);

const {
  status,
  refresh: resetPassword,
  error
} = useLazyFetch("/api/reset-password", {
  immediate: false,
  method: "POST",
  body: {
    email: profile.value?.email
  }
});
</script>
