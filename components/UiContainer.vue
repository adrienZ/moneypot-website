<template>
  <div
    :class="{
      'max-w-screen-xl mx-auto px-4': size === 'md',
      'max-w-lg mx-auto px-4': size === 'xs'
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "md" | "xs";
  }>(),
  {
    size: "md"
  }
);
</script>
