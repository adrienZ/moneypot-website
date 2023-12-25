<script lang="ts" setup>
definePageMeta({
	middleware: ["protected"]
});

const user = useAuthenticatedUser();

const handleLogout = async (e: Event) => {
	if (!(e.target instanceof HTMLFormElement)) return;
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
	<p>User id: {{ user.userId }}</p>
	<p>username: {{ user.username }}</p>
	<form method="post" action="/api/logout" @submit.prevent="handleLogout">
		<input type="submit" value="Sign out" />
	</form>
	<table v-if="allUsers?.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in allUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
        </tr>
      </tbody>
    </table>
	<p v-else>no user created yet !</p>
</template>
