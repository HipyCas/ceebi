<template>
  <main
    class="flex items-center justify-center flex-col h-screen bg-zinc-50 dark:bg-zinc-950"
  >
    <img
      src="/logo_horizontal.png"
      alt="CEEBI - Congreso Estatal de Estudiantes de Biociencias"
      class="w-6/12"
    />
    <div class="flex flex-row gap-4 mt-8">
      <NuxtLink
        to="/ii-ceebi/certificado"
        class="transition-colors bg-cblue-500 hover:bg-cblue-700 dark:hover:bg-cblue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
      >
        Certificados II CEEBI <IconArrowRight class="inline" />
      </NuxtLink>
      <NuxtLink
        to="/apps"
        class="transition-colors bg-cgreen-500 hover:bg-cgreen-700 dark:hover:bg-cgreen-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
      >
        Descarga la app <IconBrandAndroid class="inline" />
      </NuxtLink>
    </div>
    <button
      class="transition-colors mt-2 bg-transparent hover:bg-zinc-300 hover:dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 hover:text-cblue-500 text-opacity-60 font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
    >
      Otras ediciones <IconOutbound class="inline" />
    </button>
  </main>
</template>

<script setup lang="ts">
import {
  IconArrowRight,
  IconOutbound,
  IconBrandAndroid,
} from '@tabler/icons-vue';
</script>
