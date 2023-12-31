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
	<p>User id: {{ user.id }}</p>
	<p>username: {{ user.username }}</p>
	<form method="post" action="/api/logout" @submit.prevent="handleLogout">
		<input type="submit" value="Sign out" />
	</form>
	<table v-if="allUsers?.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in allUsers" :key="user.id">
          <td>{{ user.externalId }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
	<div v-else>
		<code>no user created yet !</code>
	</div>
</template>
