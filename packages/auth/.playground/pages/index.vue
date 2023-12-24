<template>
  <div v-if="bearer && user">
    <div>Welcome {{ user.user.login }}</div>
    <button @click="logout">logout</button>
  </div>
  <div v-else>go to <NuxtLink to="/login">/login</NuxtLink> please</div>
</template>

<script setup lang="ts">
const bearer = useCookie("bearer");

const { data: user } = await useFetch('/api/auth/user');

const route = useRoute();
function logout() {
  // delete cookie
  bearer.value = null;
  refreshNuxtData();
}
</script>