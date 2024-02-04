import { ref, nextTick, onMounted } from "vue";

export function useFormData(form: Ref<HTMLFormElement | undefined>) {
  const data = ref(new FormData());

  async function update(): Promise<void> {
    return nextTick().then(() => {
      data.value = new FormData(form.value);
    });
  }

  onMounted(() => form.value?.addEventListener("input", update));

  return {
    data,
    update
  };
}
