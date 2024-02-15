<template>
  <UiContainer class="my-auto">
    <section>HERO</section>
    <section>
      <UCarousel
        v-slot="{ item }"
        :items="items"
        :arrows="true"
        :indicators="true"
        :snap="true"
      >
        <img
          :src="item"
          width="300"
          class="mx-4"
          height="400"
          draggable="false"
        />
      </UCarousel>
    </section>
  </UiContainer>
</template>

<script setup lang="ts">
const items = [
  "https://picsum.photos/600/800?random=1",
  "https://picsum.photos/600/800?random=2",
  "https://picsum.photos/600/800?random=3",
  "https://picsum.photos/600/800?random=4",
  "https://picsum.photos/600/800?random=5",
  "https://picsum.photos/600/800?random=6"
];
</script>
