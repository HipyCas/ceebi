<template>
  <PageWrapper :title="'Logs'" :back="true">
    <main class="px-5">
      <h1>Logs</h1>
      <p class="mb-3">Logs de la aplicación</p>
      <LoggerVisualizer
        :logger="logger"
        export-file-name="ceebiadmin"
      ></LoggerVisualizer>
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../../components/PageWrapper.vue';
import { LoggerVisualizer } from '@code/ceebi-ui';

const logger = useLogger();
</script>
