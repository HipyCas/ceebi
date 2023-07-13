<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ notification.title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{ $t('ui.close') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <div class="ion-padding">
      <ion-text class="block" v-html="notification.body"></ion-text>
      <ion-text color="medium" class="block smaller ion-margin-top"
        >{{ $t('message.notificationSentOn') }}
        {{
          notification.schedule.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
          })
        }}</ion-text
      >
    </div>
    <ion-item
      v-for="button in notification.buttons || []"
      :key="(button.icon || 'undef') + button.text"
      @click="open(button.link, button.shortname)"
      button
      lines="full"
    >
      <!--:color="button.iconColor"-->
      <ion-icon
        v-if="button.icon !== undefined"
        slot="start"
        class="ion-margin-right"
        :icon="button.ionIcon"
      ></ion-icon>
      <!--:color="button.color"-->
      <ion-text>{{ button.text }}</ion-text>
    </ion-item>
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
  IonText,
  IonItem,
  IonIcon,
  modalController,
} from '@ionic/vue';
import { Browser } from '@capacitor/browser';
import type { NotificationContents } from '../';
import { logEvent } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const props = defineProps<{
  notification: NotificationContents;
  analytics?: Analytics;
}>();

const $t = (msg: string) => 'Cerrar';

const dismissModal = () => {
  modalController.dismiss();
};

const open = (url: string, buttonId?: string) => {
  if (buttonId !== undefined && props.analytics)
    logEvent(
      props.analytics,
      `notification_${props.notification.shortname || '_'}_${buttonId}`
    );
  Browser.open({ url });
};
</script>

<style scoped>
.block {
  display: block;
}

.smaller {
  font-size: smaller;
}
</style>
