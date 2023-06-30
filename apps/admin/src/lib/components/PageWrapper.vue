<template>
  <ion-page v-bind="$attrs">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" v-if="back">
          <ion-back-button default-href="#"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start" v-if="back">
            <ion-back-button default-href="#"></ion-back-button>
          </ion-buttons>
          <ion-title size="large">{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from '@ionic/vue';

const props = withDefaults(
  defineProps<{
    back?: boolean;
    title?: string;
  }>(),
  { back: false, title: 'CEEBI Admin' }
);
</script>
