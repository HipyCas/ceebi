<template>{{ route.params.id }}</template>

<script setup lang="ts">
definePageMeta({
  validate: (route) => /^\w+$/.test(route.params.id as string),
});

const route = useRoute();
</script>
