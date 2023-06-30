<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <SkeletonNotifications v-if="isLoading" />
      <ion-list lines="full" v-else>
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

const supabase = useSupabase();
const logger = useLogger();

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
  const { data, error } = await supabase
    .from('notifications')
    .select('id,schedule,title,icon,body');
  if (error) {
    logger.error(
      'notifications:loadNotifications',
      'supabase returned an error',
      {
        data,
        error,
      }
    );
    return [];
  }
  return data?.map((not) => ({
    ...not,
    schedule: new Date(not.schedule || Date.now()),
    ionIcon:
      ((not.icon || '').includes('logo') // @ts-expect-error Cannot index ionicons with string, but I ensure I'm indexing with a icon name
        ? ionicons[not.icon] // @ts-expect-error Cannot index ionicons with string, but I ensure I'm indexing with a icon name
        : ionicons[`${not.icon || 'paperPlane'}Outline`]) ||
      ionicons.paperPlaneOutline,
  }));
};

const { state: notifications, isLoading } = useAsyncState(
  loadNotifications,
  []
);

const showableNotifications = computed(() =>
  notifications.value.filter((not) => isAfter(today, not.schedule))
);

let notificationOpen = false;
const modal = (notification: (typeof notifications.value)[0]) => {
  if (!notificationOpen) {
    notificationOpen = true;
    showNotification(supabase, notification.id).then((modal) =>
      modal.onWillDismiss().then(() => (notificationOpen = false))
    );
  }
};
</script>

<style scoped>
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
