<template>
  <div>
    <header>
      The header
    </header>
    <hr />

    <slot />
  </div>
</template>

<script setup lang="ts">
const user = useUser();
</script>