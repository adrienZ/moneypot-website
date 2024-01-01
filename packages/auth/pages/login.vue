<script lang="ts" setup>
const user = useUser();
if (user.value) {
	await navigateTo("/"); // redirect to profile page
}


const error = ref<string | null>(null);

async function login(e: Event) {
	const result = await useFetch("/api/login", {
		method: "POST",
		body: new FormData(e.target as HTMLFormElement)
	});
	if (result.error.value) {
		error.value = result.error.value.data?.message ?? null;
	} else {
		await navigateTo("/");
	}
}
const { data: allUsers } = await useAsyncData(() => $fetch('/api/users'));
</script>

<template>
	<h1>Sign in</h1>
	<form method="post" action="/api/login" @submit.prevent="login">
		<label for="email">email</label>
		<input name="email" id="email" />
		<br />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" />
		<br />
		<input type="submit" />
	</form>
	<p>{{ error }}</p>

	<div  data-oauth >
		<a href="/api/login/github">Sign in with GitHub</a>
	</div>

	<div  data-oauth >
		<a  href="/api/login/discord">Sign in with Discord</a>
	</div>

	<div>
		<NuxtLink to="/signup">Create an account</NuxtLink>
	</div>

	<table v-if="allUsers?.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in allUsers" :key="user.id">
          <td>{{ user.externalId }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
	<div v-else>
		<code>no user created yet !</code>
	</div>
</template>