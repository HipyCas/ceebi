<template>
  <page-wrapper>
    <div class="ion-padding">
      <ion-button
        expand="block"
        size="large"
        @click="notificationsAllowed ? newNotification() : noPermission()"
        ><ion-icon slot="start" :icon="createOutline"></ion-icon> Nueva
        notificación</ion-button
      >
    </div>

    <PlainLoading v-if="isLoading" :spinner-tailwind-size="10" />

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
            class="flex-shrink-0"
            :color="
              notificationPrettyStatus(notification) === 'Publicada'
                ? 'success'
                : 'primary'
            "
            >{{ notificationPrettyStatus(notification) }}</ion-badge
          >
        </div>
        <ion-card-subtitle>{{
          intlFormat(notification.schedule)
        }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content
        v-html="extractContent(notification.body || '').slice(0, 150) + '...'"
      >
      </ion-card-content>
      <ion-button
        fill="clear"
        @click="
          notificationsAllowed ? editNotification(notification) : noPermission()
        "
        >Editar</ion-button
      >
      <ion-button
        fill="clear"
        color="secondary"
        @click="previewNotification(notification)"
        >Previsualizar</ion-button
      >
      <IonButton
        fill="clear"
        color="danger"
        @click="deleteNotification(notification)"
      >
        Eliminar
      </IonButton>
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
  IonCardSubtitle,
  IonBadge,
  modalController,
  alertController,
} from '@ionic/vue';
import PageWrapper from '../components/PageWrapper.vue';
import { createOutline } from 'ionicons/icons';
import NotificationEditor from '../components/NotificationEditorModal.vue';
import intlFormat from 'date-fns/intlFormat';
import isAfter from 'date-fns/isAfter';
import { showNotification, PlainLoading } from '@code/ceebi-ui';
import { wpapi } from '../req';
import type { WPNotification } from '@code/wp-types';
import getUnixTime from 'date-fns/getUnixTime';
import { useAsyncState } from '@vueuse/core';
import * as ionicons from 'ionicons/icons';
import { getUser } from '../user';
import { trace } from 'firebase/performance';
import { performance } from '../firebase';
import { authHeaders } from '../wpauth';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import * as StackTrace from 'stacktrace-js';
import { logCatchError } from '@code/capacitor-utils';

interface FetchNotification {
  id: number;
  title: string | null;
  body: string | null;
  schedule: Date;
}

FirebaseCrashlytics.setContext({
  key: 'page',
  type: 'string',
  value: 'notifications',
});

const logger = useLogger();
const user = getUser();

const notificationsAllowed = computed(
  () => user.value?.supabase.allow_notifications,
);

const noPermission = () => {
  alertController
    .create({
      header: 'Acción no permitida',
      message:
        'No dispones de permisos para modificar o crear notificaciones. Para más información, contacta con la organización del evento',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    })
    .then((al) => al.present());
};

const extractContent = (html: string) => {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
};

const newNotification = () => {
  if (!notificationsAllowed) noPermission();
  else
    modalController
      .create({
        component: NotificationEditor,
        componentProps: {
          action: 'create',
        },
      })
      .then((modal) => modal.present());
};

const editNotification = ({ id }: FetchNotification) => {
  if (!notificationsAllowed) noPermission();
  else
    modalController
      .create({
        component: NotificationEditor,
        componentProps: {
          action: 'edit',
          notificationId: id,
        },
      })
      .then((modal) => modal.present());
};

const previewNotification = (notification: FetchNotification) =>
  showNotification(notification);

const deleteNotification = (notification: FetchNotification) => {
  if (!notificationsAllowed) {
    noPermission();
    return;
  }
  alertController
    .create({
      header: 'Eliminar notificación',
      message: 'Esta acción es permanente, confirma antes de continuar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            alertController.dismiss();
            const res = await wpapi.delete(
              `wp/v2/notificacion/${notification.id}`,
              {
                headers: authHeaders({}),
              },
            );
            if (res.ok) {
              useToast({
                message: 'Notificación eliminada con éxito',
                icon: ionicons.checkmarkCircleOutline,
                color: 'success',
              });
              loadNotifications().then((not) => (notifications.value = not));
            } else {
              FirebaseCrashlytics.setContext({
                key: 'serverResponse',
                value: JSON.stringify(res),
                type: 'string',
              });
              FirebaseCrashlytics.recordException({
                message: 'Error when deleting notification',
              });
            }
          },
        },
      ],
    })
    .then((a) => a.present());
};

const notificationPrettyStatus = computed(
  () =>
    ({ schedule }: FetchNotification) =>
      isAfter(new Date(), schedule) ? 'Publicada' : 'Programada',
);

const loadNotifications = async () => {
  const loadTrace = trace(performance, 'loadNotifications');
  loadTrace.putAttribute('fields', 'id,acf,title');
  loadTrace.putAttribute('per_page', '100');
  loadTrace.putAttribute('platform', Capacitor.getPlatform());

  loadTrace.start();
  try {
    const data = await wpapi
      .get('wp/v2/notificacion', {
        searchParams: {
          _fields: 'id,acf,title',
          per_page: 100,
        },
      })
      .json<Array<WPNotification>>();

    loadTrace.stop();
    loadTrace.putMetric('total_users', data.length);
    return data
      ?.map((not) => ({
        id: not.id,
        shortname: not.acf.shortname,
        schedule: new Date(not.acf.schedule || Date.now()),
        title: not.title?.rendered,
        body: not.acf.body,
        buttons: Object.values(not.acf.buttons)
          .filter((b) => b.text)
          .map((but) => ({
            ...but,
            //@ts-expect-error Cannot index ionicons with this, but I'm sure it will be an ionicon valid key
            ionIcon: ionicons[but.icon || 'openOutline'],
          })),
      }))
      .sort((a, b) => getUnixTime(b.schedule) - getUnixTime(a.schedule));
  } catch (error: any) {
    loadTrace.putAttribute('is_error', 'true');
    loadTrace.putAttribute('error', error.toString());
    loadTrace.stop();
    logCatchError(
      logger,
      'notifications:loadNotifications',
      'error fetching notifications from server',
      error,
    );
    return [];
  }
};

const { state: notifications, isLoading } = useAsyncState(
  loadNotifications,
  [],
);
</script>
