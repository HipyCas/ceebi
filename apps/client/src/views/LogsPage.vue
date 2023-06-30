<template>
  <IonPage>
    <Header></Header>
    <IonContent class="ion-padding">
      <h1 class="text-3xl font-bold ml-1">Logs</h1>
      <p class="ml-1 text-md pb-2">Logs de la aplicación</p>
      <LoggerVisualizer
        :logger="logger"
        export-file-name="ceebiapp"
      ></LoggerVisualizer>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import { IonPage, IonContent } from '@ionic/vue';
import { LoggerVisualizer } from '@code/ceebi-ui';

const logger = useLogger();

console.log(logger.stream);

watch(logger.stream, (val) => {
  console.info('updated log stream', val);
});
</script>
