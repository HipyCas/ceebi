<template>
  <ul
    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-hidden"
  >
    <NuxtLink
      v-for="app in apps"
      :to="`/dev/apps/${app.id}`"
      v-wave="{
        color: 'rgb(244 244 245)',
        finalOpacity: 0,
      }"
    >
      <li class="card" :key="app.name">
        <h2
          class="text-2xl font-semibold flex flex-row items-center gap-3 mb-3"
        >
          <img class="rounded h-10" :src="app.icon" />{{ app.name }}
        </h2>
        <p>{{ app.description }}</p>
        <p class="text-zinc-400 mb-1">
          {{ app.variations }} project{{ app.variations > 1 ? 's' : '' }}
        </p>
        <ul class="w-fit flex flex-row">
          <NuxtLink
            v-for="org in app.organizations"
            :to="`/dev/organizations/${org.id}`"
            class="w-max"
          >
            <li
              v-wave
              class="m-0 flex flex-row w-max px-3 py-2 items-center gap-2 rounded-full bg-zinc-900 text-zinc-100 hover:bg-zinc-600 active:bg-zinc-800"
            >
              <img
                class="inline h-5 rounded-full"
                src="/apps/icons/clmf0t2mi0000i0op8euweszr.png"
              />
              <span>{{ org.initials }}</span>
            </li>
          </NuxtLink>
        </ul>
      </li>
    </NuxtLink>
  </ul>
</template>

<script setup lang="ts">
import { unique } from 'radash';

// const apps = shallowRef([
//   {
//     name: 'Client',
//     description: 'Client app for attendants of the congress',
//     variations: 1,
//     organization: ['CEEBI'],
//     icon: '/apps/icons/client.png',
//   },
//   {
//     name: 'Admin',
//     description: 'Mobile administration app for organizers',
//     variations: 1,
//     organization: ['CEEBI'],
//     icon: '/apps/icons/admin.png',
//   },
//   {
//     name: 'Console',
//     description: 'Web console for organizers, attendants and dev',
//     variations: 1,
//     organization: ['CEEBI'],
//     icon: '/apps/icons/admin.png',
//   },
// ]);

const { $trpc } = useNuxtApp();

const apps = shallowRef(
  (await $trpc.listApps.query()).map((app) => ({
    ...app,
    variations: app._count.appProjects,
    icon: `/apps/icons/${app.id}.png`,
    organizations: unique(
      app.appProjects.map((proj) => proj.project.organization),
      (org) => org.id,
    ),
  })),
);

console.info(apps.value);
</script>
