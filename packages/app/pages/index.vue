<script lang="ts" setup>
definePageMeta({
	middleware: ["protected"]
});

const user = useAuthenticatedUser();

const handleLogout = async () => {
	await $fetch("/api/logout", {
		method: "POST",
		redirect: "manual"
	});
	await navigateTo("/login");
};

const { data: allUsers } = await useAsyncData(() => $fetch('/api/users'));
</script>

<template>
	<h1>Profile</h1>
  <pre>{{ user  }}</pre>
	<form method="post" action="/api/logout" @submit.prevent="handleLogout">
		<input type="submit" value="Sign out" />
	</form>
	<table v-if="allUsers?.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Email Verified</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in allUsers" :key="user.id">
          <td>{{ user.externalId }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.emailVerified }}</td>
        </tr>
      </tbody>
    </table>
	<div v-else>
		<code>no user created yet !</code>
	</div>
</template>
