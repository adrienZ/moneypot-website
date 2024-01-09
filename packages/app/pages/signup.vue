<script lang="ts" setup>
definePageMeta({
	middleware: ['unlogged-middleware']
})

const error = ref<string | null>(null);

async function signup(e: Event) {
	const result = await useFetch("/api/signup", {
		method: "POST",
		body: new FormData(e.target as HTMLFormElement)
	});
	if (result.error.value) {
		error.value = result.error.value.data?.message ?? null;
	} else {
		await navigateTo("/");
	}
}
</script>

<template>
	<h1>Create an account</h1>
	<form method="post" action="/api/signup" @submit.prevent="signup">
		<label for="email">Email</label>
		<input name="email" id="email" />
		<br />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" />
		<br />
		<button type="submit">Continue</button>
	</form>
	<p>{{ error }}</p>
	<NuxtLink to="/login">Sign in</NuxtLink>
</template>