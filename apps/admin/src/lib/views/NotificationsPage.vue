<template>
  <page-wrapper>
    Hola {{ user?.username }} (password: {{ user?.password }})
    <router-link to="/p/settings">Settings</router-link>

    <div class="ion-padding">
      <ion-button expand="block" size="large"
        ><ion-icon slot="start" :icon="createOutline"></ion-icon> Nueva
        notificación</ion-button
      >
    </div>

    <ion-card v-for="notification in notifications" :key="notification.id">
      <img
        alt="Silhouette of mountains"
        src="https://ionicframework.com/docs/img/demos/card-media.png"
      />
      <ion-card-header>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: start;
          "
        >
          <ion-card-title>{{ notification.title }}</ion-card-title>
          <ion-badge
            :color="
              Math.random() > 0.5
                ? 'success'
                : Math.random() > 0.49
                ? 'medium'
                : 'primary'
            "
            >Borrador</ion-badge
          >
        </div>
        <ion-card-subtitle
          >{{ notification.schedule.day }}/{{ notification.schedule.month }}/{{
            notification.schedule.year
          }}</ion-card-subtitle
        >
      </ion-card-header>
      <ion-card-content
        v-html="extractContent(notification.body).slice(0, 150) + '...'"
      >
      </ion-card-content>
    </ion-card>
  </page-wrapper>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
} from '@ionic/vue';
import { user } from '@/lib/user';
import PageWrapper from '@/components/PageWrapper.vue';
import { ref } from 'vue';
import { createOutline } from 'ionicons/icons';

const notifications = ref([]);

(async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/notificaciones.json'
  );
  notifications.value = await res.json();
})();

const extractContent = (html: string) => {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
};
</script>
