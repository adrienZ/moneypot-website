<template>
  <div class="flex flex-col layout-default">
    <header class="py-2 border-b">
      <UiContainer class="flex justify-between">
        <div class="flex items-baseline">
          <NuxtLink to="/">Home</NuxtLink>
          <UButton class="ml-2" to="/create-moneypot">Create moneypot</UButton>
        </div>

        <NuxtLoadingIndicator :height="8" />

        <div class="flex">
          <nav>
            <ul class="flex items-center">
              <li v-if="connectedUser" class="mr-2">
                <UButton @click="handleLogout">Sign out</UButton>
              </li>
              <li v-if="connectedUser">
                <NuxtLink class="block" to="/settings">
                  <UAvatar
                    chip-color="primary"
                    chip-text=""
                    chip-position="top-right"
                    size="sm"
                    :src="connectedUser.avatar"
                    alt="Avatar"
                  />
                </NuxtLink>
              </li>
              <li v-else>
                <NuxtLink to="/login"> login </NuxtLink>
              </li>
            </ul>
          </nav>

          <ClientOnly>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />

            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </UiContainer>
    </header>

    <div class="flex-grow">
      <slot />
    </div>

    <footer class="py-2 border-t">
      <UiContainer>
        <div>v{{ $config.public.clientVersion }}</div>
        <div>@{{ new Date().getFullYear() }}</div></UiContainer
      >
    </footer>
  </div>
</template>

<script setup lang="ts">
const connectedUser = useUser();

const handleLogout = async () => {
  await $fetch("/api/logout", {
    method: "POST"
  });
  await nextTick();
  await navigateTo("/login");
};

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  }
});
</script>

<style scoped>
.layout-default {
  min-height: 100svh;
}
</style>
