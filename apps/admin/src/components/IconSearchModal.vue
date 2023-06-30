<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Seleccionar Icono</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">Cancelar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-searchbar v-model="query"></ion-searchbar>
    <div
      v-if="loading"
      style="width: 100%; height: 80%; display: grid; place-items: center"
    >
      Loading...
    </div>
    <template v-else>
      <ion-button
        v-for="icon in filteredIcons"
        :key="icon[0]"
        :fill="currentlySelected == icon[0] ? 'solid' : 'clear'"
        color="dark"
        @click="select(icon[0])"
      >
        <ion-icon slot="icon-only" :md="icon[1]" :ios="icon[1]"></ion-icon>
      </ion-button>
    </template>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
  IonSearchbar,
  modalController,
} from '@ionic/vue';
import * as ionicons from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  currentlySelected?: string;
}>();

const loading = ref(true);
const query = ref('');
let icons: [string, string][] = [];
const filteredIcons = computed(() =>
  icons.filter(([name, _]) =>
    name.toLowerCase().includes(query.value.toLowerCase())
  )
);

const dismissModal = modalController.dismiss;
const select = (iconName: string) => modalController.dismiss(iconName);

onMounted(() =>
  setTimeout(async () => {
    console.log(Object.entries(ionicons));

    icons = Object.entries(ionicons).filter(([name, icon]) =>
      name.includes('Outline')
    );

    loading.value = false;
    console.info(icons);
  }, 100)
);
</script>
