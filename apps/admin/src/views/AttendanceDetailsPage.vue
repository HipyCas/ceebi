<template>
  <PageWrapper back>
    <ion-note>Asistencia</ion-note>
    <h1 class="pt-0">Asistencia para {{ name }}</h1>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../components/PageWrapper.vue';

const route = useRoute();
const name = route.params.id;
</script>
