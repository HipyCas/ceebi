<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="qrcode" href="/code" @click="log('code')">
          <ion-icon :icon="qrCodeOutline" />
          <ion-label>{{ $t('tab.attendance') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="schedule"
          href="/schedule"
          @click="log('schedule')"
        >
          <ion-icon :icon="calendarOutline" />
          <ion-label>{{ $t('tab.schedule') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="news" href="/news" @click="log('news')">
          <ion-icon :icon="newspaperOutline" />
          <ion-label>{{ $t('tab.news') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="notifications"
          href="/notifications"
          @click="log('notifications')"
        >
          <ion-icon :icon="notificationsOutline" />
          <ion-label>{{ $t('tab.notifications') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { analytics } from '../firebase';
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import { logEvent } from 'firebase/analytics';
import {
  calendarOutline,
  newspaperOutline,
  qrCodeOutline,
  notificationsOutline,
} from 'ionicons/icons';

const logger = useLogger();

onMounted(() => {
  logger.trace(
    'tabs:onMounted',
    document.body.style.getPropertyValue('env(safe-area-inset-top)'),
    document.body.style.getPropertyValue('env(safe-area-inset-bottom)'),
  );
});

const log = (to: string) => logEvent(analytics, `navigate_${to}`);
</script>
