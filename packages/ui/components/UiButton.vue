<template>
  <div :is="htmlTag" class="UiButton">
    <slot />
  </div>
</template>

<script setup lang="ts">
const { htmlTag= "button"} = defineProps<{
  htmlTag?: "button" | "a"
}>()
</script>

<style scoped>
.UiButton {
  border: 1px solid black;
  padding: 0.5rem 1rem;
  display: inline-block;
}
</style>