<template>
  <ion-page>
    <div class="fab-flex">
      <ion-fab
        class="fab"
        @click="attendanceAllowed ? initScan() : noPermission()"
      >
        <ion-fab-button :translucent="true">
          <ion-icon :md="barcode" :ios="barcodeOutline" />
        </ion-fab-button>
      </ion-fab>
    </div>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" href="/p/schedule">
          <ion-icon :md="calendar" :ios="calendarOutline" />
          <ion-label>Horario</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="attendance" href="/p/attendance">
          <ion-icon :md="search" :ios="searchOutline" />
          <ion-label>Asistencia</ion-label>
        </ion-tab-button>

        <div style="width: 50px"></div>

        <ion-tab-button tab="notifications" href="/p/notifications">
          <ion-icon :md="chatbubbles" :ios="chatbubblesOutline" />
          <ion-label>Notificaciones</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="users" href="/p/users">
          <ion-icon :md="people" :ios="peopleOutline" />
          <ion-label>Usuarios</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonFab,
  IonFabButton,
  actionSheetController,
  alertController,
} from '@ionic/vue';
import {
  search,
  searchOutline,
  barcode,
  barcodeOutline,
  chatbubbles,
  chatbubblesOutline,
  calendar,
  calendarOutline,
  people,
  peopleOutline,
} from 'ionicons/icons';
import attendance from '../../attendance.json';
import { getUser } from '../user';

const router = useIonRouter();

const user = getUser();
const attendanceAllowed = computed(() => user.value?.supabase.allow_attendance);
const noPermission = () => {
  console.log('Hi?');
  alertController
    .create({
      header: 'Acción no permitida',
      message:
        'No dispones de permisos para tomar asistencia. Para más información, contacta con la organización del evento',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    })
    .then((al) => al.present());
};

const sessionSelected = (session: string, event?: string) => {
  // console.log(session);
  // if (session.selectableEvent) {
  // } else router.push(`/scan/${session.name}`);
  router.push({
    name: 'scan',
    params: {
      session,
      event,
    },
  });
};

const initScan = async () => {
  BarcodeScanner.prepare();

  const sheet = await actionSheetController.create({
    header: 'Seleccionar sesión',
    buttons: [
      ...attendance.map((session) => ({
        text: session.name,
        handler: async () => {
          if (session.hasEvents) {
            const act = await actionSheetController.create({
              header: 'Seleccionar evento',
              buttons: [
                ...session.events.map((event) => ({
                  text: event,
                  handler: () => sessionSelected(session.name, event),
                })),
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'cancel-button',
                },
              ],
            });
            act.present();
          } else {
            sessionSelected(session.name);
          }
        },
      })),
      // {
      //   text: 'Miércoles 17.30 - 20.00',
      //   handler: () =>
      //     sessionSelected({
      //       name: 'Miércoles 17.30 - 20.00',
      //       selectableEvent: false,
      //     }),
      // },
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'cancel-button',
      },
    ],
  });
  sheet.present();
};
</script>

<style scoped>
.fab-flex {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100vw;
  height: 120px;
  align-items: center;
  justify-content: center;
}
</style>

<style>
.cancel-button {
  color: var(--ion-color-danger) !important;
}
</style>
