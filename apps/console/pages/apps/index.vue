<template>
  <main
    class="flex items-center justify-center flex-col h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50"
  >
    <h1 class="text-5xl font-black tracking-wider mb-8">
      <IconBrandAndroid class="inline-block h-12 w-12 -mt-2" /> Apps
    </h1>
    <div
      class="flex flex-row items-center w-11/12 md:w-8/12 lg:w-7/12 xl:w-6/12 2xl:w-5/12 hover:bg-zinc-200 dark:hover:bg-zinc-800 p-4 rounded"
      v-for="proj in publicProjectApps"
    >
      <img :src="`/apps/icons/${proj.appId}.png`" class="h-16 w-16 rounded" />
      <h2 class="font-semibold text-3xl ml-4 flex-grow">
        {{ proj.project.name }}
      </h2>
      <a
        class="button primary"
        :href="`/apps/versions/${proj.id}/${proj.versions.at(0)?.code}.apk`"
        download
        ><span class="hidden sm:inline">Descargar</span>
        <IconDownload class="inline -mt-1 sm:ml-1"
      /></a>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconBrandAndroid, IconDownload } from '@tabler/icons-vue';

const { $trpc } = useNuxtApp();

const publicProjectApps = await $trpc.getPublicProjectApps.query();
</script>
