<template>
  <section>
    <UCard>
      <div>
        Two factor Authentication:
        <UBadge v-if="profile.twoFactorEnabled">ON</UBadge>
        <UBadge v-else color="white" variant="solid">NOT ACTIVATED</UBadge>
      </div>
      <div class="mt-4" v-if="!profile.twoFactorEnabled">
        <UButton
          v-if="!enabled"
          color="white"
          variant="solid"
          @click="enabled = true"
          >Enable 2FA</UButton
        >
        <div v-else>
          <div>1. Scan this qrcode with google authentificator</div>
          <img :src="profile.qrcode" />
          <br />
          <div>2. Enter the code in the google autificator app</div>
          <form
            method="post"
            action="/api/auth/setup-2fa"
            @submit.prevent="send2FACodeSetup"
          >
            <div class="flex items-end">
              <UFormGroup label="Code" class="flex-grow mr-4">
                <UInput
                  id="code"
                  v-model="code"
                  name="code"
                  :loading="request.status.value === 'pending'"
                />
              </UFormGroup>

              <UButton type="submit">Validate</UButton>
            </div>
          </form>

          <UAlert
            v-if="responseText"
            class="mt-3"
            :color="request.error.value ? 'red' : 'primary'"
            variant="subtle"
            :title="responseText"
          ></UAlert>
        </div>
      </div>
    </UCard>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
  apiDedupeKey?: string;
}>();

const enabled = defineModel<boolean>("enabled", {
  required: true
});

const code = ref("");

const { data: profile, refresh } = await useFetch("/api/me", {
  key: props.apiDedupeKey
});

const request = await useLazyFetch("/api/auth/setup-2fa", {
  method: "POST",
  // only submit with the form
  immediate: false,
  body: {
    code
  },
  // do not trigger on each keystroke
  watch: false
});

const responseText = computed(() => {
  if (request.status.value === "error") {
    return "error: " + request.error.value;
  }

  if (request.status.value === "success") {
    return "sucess";
  }
});

async function send2FACodeSetup() {
  await request.execute();

  if (request.status.value === "success") {
    await refresh();
    enabled.value = true;
  }
}
</script>
