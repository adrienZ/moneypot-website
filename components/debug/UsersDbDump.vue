<template>
  <UTable :columns="columns" :rows="allUsersData">
    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic text-sm">No users here!</span>
      </div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
const { data: allUsers, refresh } = await useAsyncData(
  "usersDump",
  () => $fetch("/api/users"),
  {}
);

const { $router } = useNuxtApp();
$router.beforeResolve(() => {
  refresh();
  return true;
});

const columns = [
  {
    key: "id",
    label: "ID"
  },
  {
    key: "email",
    label: "Email",
    sortable: true
  },
  {
    key: "email-verified",
    label: "Email verified",
    sortable: true
  },
  {
    key: "avatar",
    label: "Avatar"
  },
  {
    key: "password",
    label: "Password"
  }
];

const allUsersData = computed(() =>
  (allUsers.value ?? []).map((user) => {
    return {
      id: user.externalId,
      email: user.email,
      "email-verified": user.emailVerified,
      avatar: user.avatar,
      password: user.password
    };
  })
);
</script>
