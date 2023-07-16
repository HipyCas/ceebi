<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <SkeletonNotifications v-if="isLoading || loadingUser" />
      <ion-list
        lines="full"
        v-else-if="user && showableNotifications.length > 0"
      >
        <ion-item
          v-for="notification in showableNotifications"
          :key="notification.id"
          @click="modal(notification)"
          detail
          button
        >
          <ion-icon
            slot="start"
            :md="notification.ionIcon"
            :ios="notification.ionIcon"
          ></ion-icon>
          <div style="display: flex; flex-direction: column">
            <ion-text>{{ notification.title }}</ion-text>
            <ion-note>
              {{ extractContent(notification.body || '').substring(0, 30) }}...
            </ion-note>
          </div>
        </ion-item>
      </ion-list>
      <div v-else class="center-content">
        <p v-if="user">
          {{ $t('notifications.noneYet') }}
        </p>
        <LoginRequired
          v-else
          :reason="$t('notifications.reasonLoginRequired')"
        ></LoginRequired>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonList,
  IonNote,
  IonText,
} from '@ionic/vue';
import * as ionicons from 'ionicons/icons';
import Header from '../components/Header.vue';
import SkeletonNotifications from '../components/SkeletonNotifications.vue';
import { extractContent } from '../util';
import { useAsyncState } from '@vueuse/core';
import isAfter from 'date-fns/isAfter';
import { showNotification } from '@code/ceebi-ui';
import { wpapi } from '../req';
import type { WPNotification } from '@code/wp-types';
import getUnixTime from 'date-fns/getUnixTime';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { loadingUser, getUser } from '../user';
import LoginRequired from '../components/LoginRequired.vue';
import { logCatchError } from '@code/capacitor-utils';

interface RenderableNotification {
  id: number;
  title: string;
  shortname: string;
  body: string;
  ionIcon: string;
  schedule: Date;
  buttons: Array<{
    icon: string;
    text: string;
    shortname?: string;
    ionIcon: string;
    link: string;
  }>;
}

const { t } = useI18n();
const logger = useLogger();

const user = getUser();

//#region CONNECTION
const connected = ref(true);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
})();
Network.addListener('networkStatusChange', (status) => {
  connected.value = status.connected;
});
//#endregion

const today = new Date();

// TODO Proper error handling
const loadNotifications = async () => {
  try {
    const data = await wpapi
      .get('wp/v2/notificacion', {
        searchParams: {
          _fields: 'id,acf,title',
          per_page: 100,
        },
      })
      .json<Array<WPNotification>>();
    return data
      ?.map(
        (not) =>
          ({
            id: not.id,
            shortname: not.acf.shortname,
            schedule: new Date(not.acf.schedule || Date.now()),
            title: not.title?.rendered,
            body: not.acf.body,
            //@ts-expect-error Cannot index ionicons with this, but I'm sure it will be an ionicon valid key
            ionIcon: ionicons[not.acf.icon || 'paperPlaneOutline'],
            buttons: Object.values(not.acf.buttons)
              .filter((b) => b.text)
              .map((but) => ({
                ...but,
                //@ts-expect-error Cannot index ionicons with this, but I'm sure it will be an ionicon valid key
                ionIcon: ionicons[but.icon || 'openOutline'],
              })),
          } as RenderableNotification)
      )
      .sort((a, b) => getUnixTime(b.schedule) - getUnixTime(a.schedule));
  } catch (error) {
    logCatchError(
      logger,
      'notifications:loadNotifications',
      'error fetching notifications from server',
      error
    );
    useToast({
      message: t('notifications.errorFetching'),
      color: 'danger',
      icon: ionicons.alertCircleOutline,
    });
    return [];
  }
};

const { state: notifications, isLoading } = useAsyncState(
  loadNotifications,
  []
);

const showableNotifications = computed(() =>
  notifications.value.filter((not) => isAfter(today, not.schedule))
);

let notificationOpen = false;
const modal = (notification: RenderableNotification) => {
  if (!notificationOpen) {
    notificationOpen = true;
    showNotification(notification, analytics).then((modal) =>
      modal.onWillDismiss().then(() => (notificationOpen = false))
    );
    logEvent(analytics, `notification_${notification.shortname}`);
  }
};
</script>

<style scoped>
.center-content {
  top: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.container > ion-icon {
  margin-bottom: 0.2em;
}

.container > ion-note {
  margin-top: 0.3em;
}
</style>
