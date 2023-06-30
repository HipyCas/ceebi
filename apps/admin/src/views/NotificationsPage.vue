<template>
  <page-wrapper>
    <div class="ion-padding">
      <ion-button expand="block" size="large" @click="newNotification"
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
      <ion-button fill="clear" @click="editNotification(notification)"
        >Editar</ion-button
      >
      <ion-button
        fill="clear"
        color="secondary"
        @click="previewNotification(notification)"
        >Previsualizar</ion-button
      >
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
} from '@ionic/vue';
import PageWrapper from '../components/PageWrapper.vue';
import { createOutline } from 'ionicons/icons';
import NotificationEditor from '../components/NotificationModal.vue';
import intlFormat from 'date-fns/intlFormat';
import isAfter from 'date-fns/isAfter';
import { showNotification } from '@code/ceebi-ui';

interface FetchNotification {
  id: number;
  title: string | null;
  body: string | null;
  schedule: Date;
}

const supabase = useSupabase();

const notifications = ref([] as FetchNotification[]);

const extractContent = (html: string) => {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
};

const newNotification = () => {
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
  showNotification(supabase, notification.id);

const notificationPrettyStatus = computed(
  () =>
    ({ schedule }: FetchNotification) =>
      isAfter(new Date(), schedule) ? 'Publicada' : 'Programada'
);

onMounted(async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id,title,body,schedule');
  if (error) {
  } else {
    notifications.value = data.map((not) => ({
      ...not,
      schedule: new Date(not.schedule || Date.now()),
    }));
  }
});
</script>
