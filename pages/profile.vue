<template>
  <main class="container mx-auto">
    <form v-if="profile" novalidate>
      <UAvatar size="xl" :src="profile.avatar" alt="Avatar" />

      <UFormGroup label="Username">
        <UInput readonly name="Username" :value="profile.username" />
      </UFormGroup>

      <UFormGroup label="Email" class="mt-4">
        <UInput readonly name="Email" :value="profile.email" />
        <template #hint>
          <UBadge v-if="profile.emailVerified">Verified</UBadge>
          <UBadge v-else color="white" variant="solid">Not verified</UBadge>
        </template>
      </UFormGroup>

      <div class="mt-4">
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

    <div class="mt-8">
      <h3>Sessions</h3>

      <UTable
        v-model="selectedSessions"
        :columns="
          Object.keys(profile.sessions.at(0)).map((label) => ({
            key: label,
            label
          }))
        "
        :rows="profile.sessions"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Session } from "lucia";

definePageMeta({
  middleware: ["protected-middleware"]
});

const user = useUser();
const { data: profile } = await useFetch(() => "/api/me", {
  key: `profile-${user.value?.externalId}`
});

const selectedSessions = ref<Session[]>([]);
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
