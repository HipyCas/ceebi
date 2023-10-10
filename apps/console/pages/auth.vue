<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const route = useRoute();

const user = useUser();
if (user.value) {
  navigateTo(route.query.next ? route.query.next.toString() : '/admin');
}
</script>
