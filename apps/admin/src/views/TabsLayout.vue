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
  alertCircleOutline,
} from 'ionicons/icons';
import type attendanceSchema from '../../attendance.json';
import { getUser } from '../user';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { logCatchError } from '@code/capacitor-utils';

const router = useIonRouter();
const logger = useLogger();
const supabase = useSupabase();

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

  const { data: fileURL } = await supabase.storage
    .from('config')
    .getPublicUrl('attendance.json');
  let attendance:
    | typeof attendanceSchema
    | {
        error: string;
        message: string;
        statusCode: string;
      };
  try {
    const res = await fetch(fileURL.publicUrl);
    attendance = await res.json();
    // @ts-expect-error This checks if there is an error
    if (attendance['error']) {
      logger.error(
        'attendanceModal:main',
        'http error when fetching attendance',
        { data: attendance }
      );
      FirebaseCrashlytics.setContext({
        key: 'error',
        type: 'string',
        // @ts-expect-error If it is an error, this will exist
        value: attendance['error'],
      });
      FirebaseCrashlytics.setContext({
        key: 'message',
        type: 'string',
        // @ts-expect-error If it is an error, this will exist
        value: attendance['message'],
      });
      FirebaseCrashlytics.setContext({
        key: 'statusCode',
        type: 'string',
        // @ts-expect-error If it is an error, this will exist
        value: attendance['statusCode'],
      });
      FirebaseCrashlytics.setContext({
        key: 'response',
        type: 'string',
        value: JSON.stringify(attendance),
      });
      StackTrace.fromError(
        new Error('http error when fetching attendance schema')
      ).then((stacktrace) =>
        FirebaseCrashlytics.recordException({
          message: 'http error when fetching attendance',
          stacktrace,
        })
      );
      return;
    }
  } catch (e) {
    logCatchError(
      logger,
      'attendanceModal:main',
      'error fetching attendance schema',
      e
    );
    useToast({
      message: 'Error al obtener la asistencia',
      color: 'danger',
      icon: alertCircleOutline,
    });
    return;
  }

  const sheet = await actionSheetController.create({
    header: 'Seleccionar sesión',
    buttons: [
      ...(attendance as typeof attendanceSchema).map((session) => ({
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
