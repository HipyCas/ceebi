<template>
  <PageWrapper>
    <main class="flex flex-col items-center justify-center h-full">
      <img class="w-6/12" :src="undraw_app_wireframe" alt="" />
      <h1 class="text-xl font-semibold">En construcción</h1>
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import undraw_app_wireframe from '../assets/undraw_app_wireframe_re_d467.svg';
</script>
