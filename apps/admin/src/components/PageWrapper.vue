<template>
  <ion-page v-bind="$attrs">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" v-if="back">
          <ion-back-button
            default-href="/p/notifications"
            @click.prevent="
              (e) =>
                route.query.back ? router.push(route.query.back) : router.back()
            "
          ></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            shape="round"
            class="relative block p-0"
            @click="openPopover($event)"
          >
            <IonAvatar class="menu-avatar">
              <img
                :src="user?.wp.avatar_urls[96]"
                class="h-full w-auto aspect-square"
              />
            </IonAvatar>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" v-once>{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <slot></slot>
    </ion-content>
  </ion-page>
  <IonPopover
    :is-open="popoverOpen"
    :event="popoverEvent"
    @didDismiss="popoverOpen = false"
  >
    <IonContent>
      <ion-item lines="none">
        <IonLabel color="medium">{{ user?.wp.name }}</IonLabel>
      </ion-item>
      <router-link to="/p/settings" @click="popoverOpen = false">
        <IonItem button>
          <ion-icon :icon="settingsOutline" slot="start"></ion-icon>
          <IonLabel>Ajustes</IonLabel>
        </IonItem>
      </router-link>
      <router-link to="/p/settings" @click="popoverOpen = false">
        <IonItem button>
          <ion-icon :icon="informationCircleOutline" slot="start"></ion-icon>
          <IonLabel>Info y ayuda</IonLabel>
        </IonItem>
      </router-link>
      <IonItem @click="logout" button>
        <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
        <IonLabel>Cerrar sesión</IonLabel>
      </IonItem>
    </IonContent>
  </IonPopover>
</template>

<script setup lang="ts">
import {
  settingsOutline,
  logOutOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonPopover,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  useIonRouter,
} from '@ionic/vue';
import { getUser, clearUser } from '../user';
import { clearWPToken } from '../wpauth';

withDefaults(
  defineProps<{
    back?: boolean;
    title?: string;
  }>(),
  { back: false, title: 'CEEBI Admin' }
);

const router = useIonRouter();
const route = useRoute();

const user = getUser();

const popoverOpen = ref(false);
const popoverEvent = ref(null);

const openPopover = (ev: any) => {
  popoverEvent.value = ev;
  popoverOpen.value = true;
};

const logout = () => {
  clearUser();
  clearWPToken();
  popoverOpen.value = false;
  router.push('/auth');
};
</script>

<style scoped>
.menu-avatar.md {
  @apply sticky h-8 top-0 right-0 m-0 -mr-8;
}

.menu-avatar.ios {
  @apply sticky h-8 top-0 right-0 m-0 -mr-4;
}
</style>
