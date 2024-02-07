<template>
  <div>
    <div v-if="imageSrc" class="relative inline-block">
      <UAvatar
        class="block overflow-hidden"
        :imgClass="`object-cover transition ${isUploadig ? 'blur-sm' : 'blur-0'}`"
        size="3xl"
        text="I"
        :src="imageSrc"
      />

      <label
        role="button"
        :for="inputId"
        tabindex="0"
        class="absolute inline-flex p-2 translate-x-1/4 bottom-0 right-0 rounded-full bg-red-500"
      >
        <UIcon name="i-heroicons-pencil" />
      </label>
    </div>
    <div v-else class="w-32">
      <AspectRatio :ratio="4 / 3">
        <label
          role="button"
          tabindex="0"
          :for="inputId"
          class="flex items-center text-center justify-center border border-gray-300 h-full w-full rounded"
        >
          <span>Upload your avatar here</span>
        </label>
      </AspectRatio>
    </div>

    <input
      :id="inputId"
      type="file"
      :name="name"
      class="hidden"
      accept="image/png, image/jpeg, image/jpg, image/webp"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { AspectRatio } from "radix-vue";

withDefaults(
  defineProps<{
    name: string;
    isUploadig?: boolean;
  }>(),
  {
    isUploadig: false
  }
);

const emit = defineEmits<{
  (event: "change", value: File): void;
}>();

const inputId = useId();

const imageSrc = defineModel<string>("imageSrc");

function toBase64(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString());
    reader.onerror = reject;
  });
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;

  const fileToProceed = target.files?.item(0);

  if (!fileToProceed) {
    return;
  }

  const preview = await toBase64(fileToProceed);
  if (preview) {
    emit("change", fileToProceed);
    // nextTick to prevent setting the image src before the blur css effect
    await nextTick();
    imageSrc.value = preview;
  }
}
</script>

<style></style>
