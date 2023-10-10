<template>
  <h1 class="text-3xl font-bold">Organizaciones</h1>
  <p class="mb-4">Organizaciones registradas en la plataforma</p>

  <table class="table-auto w-full">
    <thead>
      <tr>
        <td class="p-2 border-b"><input type="checkbox" /></td>
        <td class="font-bold p-2 border-b text-left">Name</td>
        <td class="font-bold p-2 border-b text-center">Initials</td>
        <td class="font-bold p-2 border-b text-center">Users</td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="org in organizations"
        class="hover:bg-zinc-800"
        v-wave
        @click="() => navigateTo(`/dev/organizations/${org.id}`)"
      >
        <td class="p-2 border-b border-zinc-600">
          <input type="checkbox" @click.stop="() => {}" />
        </td>
        <td class="p-2 border-b border-zinc-600 text-left">
          {{ org.full_name }}
        </td>
        <td class="p-2 border-b border-zinc-600 text-center">
          {{ org.initials }}
        </td>
        <td class="p-2 border-b border-zinc-600 text-center">
          {{ org._count.users }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp();

const organizations = await $trpc.listOrganizations.query({
  include: {
    _count: {
      select: {
        users: true,
      },
    },
  },
});
</script>
