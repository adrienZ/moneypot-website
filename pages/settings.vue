<template>
  <UiContainer v-if="profile" as="main">
    <header>
      <h1 class="text-xl font-bold">Settings</h1>
    </header>

    <UDivider class="my-4" />

    <form>
      <UFormGroup label="Avatar">
        <UiUploadableAvatar
          name="avatar"
          :image-src="profile.avatar"
          :isUploadig="avatarIsUploading"
          @change="handleAvatar"
        />
      </UFormGroup>

      <UFormGroup class="mt-4" label="Username">
        <UInput readonly name="Username" :value="profile.username" />
      </UFormGroup>

      <UFormGroup label="Email" class="mt-4">
        <UInput readonly name="Email" :value="profile.email" />
        <template #hint>
          <UBadge v-if="profile.emailVerified">Verified</UBadge>
          <UBadge v-else color="white" variant="solid">Not verified</UBadge>
        </template>
      </UFormGroup>

      <UDivider class="my-4" />

      <ProfileTwoFactorAuth
        class="mt-8"
        :api-dedupe-key="PROFILE_KEY_DEDUPE"
        :enabled="profile.twoFactorEnabled"
      />

      <UDivider class="my-4" />

      <UCard class="mt-4">
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
      </UCard>
    </form>

    <UDivider class="my-4" />

    <UCard class="mt-8">
      <h3>Sessions</h3>

      <div v-for="session in profile.sessions" :key="session.id" class="mt-4">
        <UDivider class="my-4" />

        <div>
          <span v-if="session.os">{{ session.os.name }}</span>
          <span v-if="session.browser"> - {{ session.browser.name }}</span>
        </div>
        <div>
          {{ session.ip
          }}<UBadge v-if="session.isCurrentSession">This device</UBadge>
        </div>
        <time
          v-if="session.createdAt"
          class="block"
          :datetime="session.createdAt"
        >
          {{
            new Date(session.createdAt).toLocaleTimeString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          }}
        </time>
      </div>
    </UCard>
  </UiContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected-middleware"]
});

const user = useUser();
const PROFILE_KEY_DEDUPE = `profile-${user.value?.externalId}`;
const { data: profile, refresh: refreshProfile } = await useFetch(
  () => "/api/me",
  {
    key: PROFILE_KEY_DEDUPE
  }
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

const avatarIsUploading = ref(false);
async function handleAvatar(avatarFile: File) {
  const formData = new FormData();
  formData.set("avatar", avatarFile);
  avatarIsUploading.value = true;

  try {
    const response = await $fetch("/api/auth/avatar", {
      method: "post",
      body: formData
    });

    if (response.isUserUpdated) {
      refreshProfile();
    }
  } finally {
    avatarIsUploading.value = false;
  }
}
</script>
