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
    </footer>
  </div>
</template>

<script setup lang="ts">
const user = useUser();
</script>