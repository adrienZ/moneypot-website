<template>
  <main>
    <form novalidate v-if="profile">
      <div>
        <label>Username</label>
        <input readonly :value="profile.username" />
      </div>
      <div>
        <label>Email</label>
        <input readonly :value="profile.email" />
      </div>

      <div>
        <button type="button" :disabled="status === 'pending' || status === 'success'" @click="resetPassword()">reset password </button>
        <p v-if="status === 'success'">Your password reset link was sent to your inbox</p>
        <p v-if="status === 'error'">{{error}}</p>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["protected-middleware"]
});

const user = useUser();
const { data: profile } = await useAsyncData(`${user.value?.externalId}-profile`, () => $fetch("/api/me"));


const { status, refresh: resetPassword, error } = useLazyFetch('/api/reset-password', { 
  immediate: false,
  method: "POST",
  body: {
    email: profile.value?.email
  }
});
</script>