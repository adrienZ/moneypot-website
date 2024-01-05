<template>
  <div>
    <header>
      The header

      <nav>
        <ul>
          <li v-if="user">
            <form method="post" action="/api/logout" @submit.prevent="handleLogout">
              <input type="submit" value="Sign out" />
            </form>
          </li>
          <li v-if="user && $route.path !== '/profile'">
            <NuxtLink to="/profile">Profile</NuxtLink>
          </li>
          <li v-if="user && $route.path === '/profile'">
            <NuxtLink to="/">Home</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
    <hr />
    <br />

    <slot />

    <br />

    <hr />
    <footer>
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

    </footer>
  </div>
</template>

<script setup lang="ts">
const user = useUser();
const { data: allUsers } = await useAsyncData(() => $fetch('/api/users'));

const handleLogout = async () => {
	await $fetch("/api/logout", {
		method: "POST",
		redirect: "manual"
	});
	await navigateTo("/login");
};
</script>