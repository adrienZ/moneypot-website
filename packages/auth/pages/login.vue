<template>
    <a :href="oauth.authEndpoint">login with github</a>
</template>

<script setup lang="ts">
const { data: oauth } = await useFetch("/api/auth/github/login");
</script>