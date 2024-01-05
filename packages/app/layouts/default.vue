<template>
  <div>
    <header>
      The header
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
</script>