<script lang="ts" setup>
definePageMeta({
	middleware: ["protected"]
});

const user = useAuthenticatedUser();


async function logout() {
	await useFetch("/api/logout", {
		method: "POST"
	});
	navigateTo("/login");
}
</script>

<template>
	<p>User id: {{ user.id }}</p>
	<p>email: {{ user.email }}</p>
	<form method="post" action="/api/logout" @submit.prevent="logout">
		<input type="submit" value="Sign out" />
	</form>
</template>
