<template>
  <div>
    <header>
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
                <form
                  method="post"
                  action="/api/logout"
                  @submit.prevent="handleLogout"
                >
                  <input type="submit" value="Sign out" />
                </form>
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
    <hr />
    <br />

    <slot />

    <br />

    <hr />
    <footer>
      <UiContainer> footer </UiContainer>
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
