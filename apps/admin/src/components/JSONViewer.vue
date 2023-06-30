<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>JSON data</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">Cerrar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <VueJsonPretty
      :data="data"
      :show-line="true"
      :show-line-number="true"
    ></VueJsonPretty>
  </ion-content>
</template>

<script setup lang="ts">
import { modalController } from '@ionic/vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/vue';

defineProps<{
  data: Record<any, any>;
}>();

const dismissModal = modalController.dismiss;
</script>
