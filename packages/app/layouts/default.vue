<template>
  <div>
    <header>
      <UContainer>
        The header

        <nav>
          <ul>
            <li v-if="connectedUser">
              <form
                method="post"
                action="/api/logout"
                @submit.prevent="handleLogout"
              >
                <input type="submit" value="Sign out" />
              </form>
            </li>
            <li v-if="connectedUser && $route.path !== '/profile'">
              <NuxtLink to="/profile">Profile</NuxtLink>
            </li>
            <li v-if="connectedUser && $route.path === '/profile'">
              <NuxtLink to="/">Home</NuxtLink>
            </li>
          </ul>
        </nav>

        <ClientOnly>
          <UButton
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
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
      </UContainer>
    </header>
    <hr />
    <br />

    <UContainer>
      <slot />
    </UContainer>

    <br />

    <hr />
    <footer>
      <UContainer>
        The footer

        <table v-if="allUsers?.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Email Verified</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in allUsers" :key="user.id">
              <td>{{ user.externalId }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.emailVerified }}</td>
              <td>{{ user.password }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <code>no user created yet !</code>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
const connectedUser = useUser();
const { data: allUsers } = await useAsyncData(() => $fetch("/api/users"));

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
