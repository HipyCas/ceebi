<template>
  <nav
    class="border-b dark:border-zinc-900 bg-white dark:bg-gray-950 dark:text-gray-50"
  >
    <div
      class="flex flex-col md:flex-row items-center justify-between w-full px-4 mx-auto"
    >
      <div class="flex-1 items-center flex-grow">
        <div class="w-fit max-w-[200px] mx-5 pt-2 pb-2">
          <img
            :src="logoHorizontal"
            alt="CEEBI"
            class="min-w-[200px] max-h-fit"
          />
        </div>
      </div>
      <div class="flex-2 items-center justify-center flex-grow my-2">
        <h1 class="text-2xl font-bold text-center">{{ title }}</h1>
      </div>
      <div class="flex-1 items-center flex-grow">
        <div class="flex justify-end">
          <NuxtLink
            to="/ii-ceebi/consulta"
            class="mx-2 my-2 text-lg font-bold focus:outline-none hover:text-cblue-500 focus:text-cblue-500"
            :class="{ 'text-cblue-500': $route.path === '/ii-ceebi/consulta' }"
            >Consulta</NuxtLink
          >
          <NuxtLink
            to="/ii-ceebi/certificado"
            class="mx-2 my-2 text-lg font-bold focus:outline-none hover:text-cblue-500 focus:text-cblue-500"
            :class="{
              'text-cblue-500': $route.path === '/ii-ceebi/certificado',
            }"
            >Certificado</NuxtLink
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logoHorizontal from '~~/assets/img/logo-ceebi-horizontal.png';

defineProps({
  title: String,
});
</script>
