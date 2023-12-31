<script setup lang="ts">
import { ETailwind, EText } from 'vue-email'


defineProps(["username"])
</script>

<template>
  <ETailwind>
    <slot />
    <EText class="text-accent text-center">
      BaseEmail Component {{ username }}
    </EText>
  </ETailwind>
</template>