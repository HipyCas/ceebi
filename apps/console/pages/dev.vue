<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dev',
  middleware: ['protected', 'dev'],
});
</script>
