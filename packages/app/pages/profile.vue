<template>
  <main>
    <form novalidate>
      <div>
        <label>User id: </label>
        <input readonly :value="user?.externalId" />
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["protected"]
});

const user = useUser();
</script>