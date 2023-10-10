<template>
  <h1 class="text-3xl font-bold">Aplicaciones</h1>
  <p>Aplicaciones disponibles para el evento</p>
  <ul
    v-if="apps"
    class="mt-4 grid grid-cols-1 items-stretch justify-stretch sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-hidden"
  >
    <NuxtLink
      v-for="app in apps"
      :to="`/admin/${$route.params.project}/apps/${app.app.id}`"
      v-wave="{
        color: 'rgb(244 244 245)',
        finalOpacity: 0,
      }"
    >
      <li class="card h-full w-full" :key="app.app.name">
        <h2
          class="text-2xl font-semibold flex flex-row items-center gap-3 mb-3"
        >
          <img class="rounded h-10" :src="`/apps/icons/${app.app.id}.png`" />{{
            app.app.name
          }}
        </h2>
        <p>{{ app.app.description }}</p>
      </li>
    </NuxtLink>
  </ul>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp();
const route = useRoute();

const apps = shallowRef(
  await $trpc.getApps.query({ projectId: route.params.project as string })
);
</script>
