<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ $t('message.attendance') }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{ $t('ui.close') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <no-connection v-if="!connected">
      {{ $t('message.attendanceConnectToSee') }}
    </no-connection>

    <div v-else-if="loading" class="wrapper">
      <PlainLoading :spinner-tailwind-size="10"></PlainLoading>
    </div>

    <template v-else-if="items.length > 0">
      <canvas class="confetti-canvas"></canvas>
      <div class="circ-wrapper">
        <div class="relative">
          <circle-progress
            class="h-[80%]"
            :percent="Math.round((Math.min(25, hoursDone) / 25) * 100)"
            :is-gradient="true"
            :gradient="{
              angle: 90,
              startColor: style.getPropertyValue('--ion-color-primary'),
              stopColor: style.getPropertyValue('--ion-color-primary'),
            }"
            circle-color="transparent"
            :border-width="12"
          >
          </circle-progress>
          <span style="font-size: 24px" class="absolute top-[39%] left-[39%]">
            {{ Math.round((Math.min(25, hoursDone) / 25) * 100) }}%
          </span>
        </div>
        <span style="font-size: 20px; font-weight: 500">
          {{ $t('message.youveAssistedTo') }} {{ hoursDone }}
          {{ $t('message.outOfTotalOf') }}
        </span>
      </div>
      <div class="grid place-items-center py-2">
        <IonButton
          :size="hoursDone >= 25 * 0.8 ? 'large' : undefined"
          :disabled="!(hoursDone >= 25 * 0.8)"
          :color="hoursDone >= 25 * 0.8 ? 'success' : 'medium'"
          @click.capture="downloadCerts"
          >Download Certificates</IonButton
        >
      </div>
      <ion-list>
        <ion-list-header class="text-lg underline">
          {{ $t('message.eventsYouveAssisted') }}
        </ion-list-header>
        <template v-for="item in items" :key="item.time">
          <ion-item
            v-for="(event, index) in  (item.events as string[])"
            :key="event"
          >
            <span
              style="
                color: var(--ion-color-primary);
                margin-right: 0.4rem;
                font-weight: 700;
              "
              >{{ (item.eventHours || ['-', '-', '-'])[index] }}h</span
            >{{ event }}
          </ion-item>
        </template>
      </ion-list>
    </template>

    <div v-else class="wrapper">
      <span>{{ $t('message.noAssistance') }}</span>
    </div>
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
  IonSpinner,
  IonItem,
  IonList,
  IonListHeader,
  modalController,
  actionSheetController,
} from '@ionic/vue';
import type { ActionSheetButton } from '@ionic/vue';
// import { VueEllipseProgress } from 'vue-ellipse-progress';
import confetti from 'canvas-confetti';
import NoConnection from './NoConnection.vue';
//@ts-expect-error vue3-circle-progress has no support for TypeScript
import CircleProgress from 'vue3-circle-progress';
import { getUser } from '../user';
import attendanceSchema from '../../attendance.json';
import parseISO from 'date-fns/parseISO';
import { computedEager, until, useMounted } from '@vueuse/core';
import type { WPUser } from '@code/wp-types';
import isBefore from 'date-fns/isBefore';
import { imageOutline, stopwatchOutline, closeOutline } from 'ionicons/icons';
import { PlainLoading } from '@code/ceebi-ui';

// defineProps<{
//   dni: string;
// }>();

const supabase = useSupabase();
const logger = useLogger();

const user = getUser();
const isMounted = useMounted();

const style = getComputedStyle(document.body);

// const hoursDone = 13;

const connected = ref(true);
const loading = ref(true);
const items = ref(
  [] as {
    time: Date;
    events?: string[];
    eventHours?: number[];
    hours?: number;
  }[]
);

const dismissModal = () => modalController.dismiss();

// const items = ref([]);
// const connected = ref(true);
(async () => (connected.value = (await Network.getStatus()).connected))();
// const loading = ref(true);
const hoursDone = computed(
  () =>
    items.value
      .map((item) => item.hours)
      .reduce((prev, curr) => prev + curr, 0) as number
);

// const removeDuplicates = (duplicates: DocumentData[]) => {
//   const flag: Record<any, any> = {};
//   const unique: DocumentData[] = [];
//   duplicates.forEach((elem) => {
//     if (!flag[elem.session]) {
//       flag[elem.session] = true;
//       unique.push(elem);
//     }
//   });
//   console.info('HEY HEY HEY -> Flags:', flag);
//   return unique;
// };

const main = async () => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('attendant_id', user.value.acf.id_base_de_datos_app);
  if (!error && data) {
    items.value = data?.map((att) => ({
      time: parseISO(att.date || ''),
      events: att.event
        ? [att.event]
        : attendanceSchema.find((schema) => schema.name === att.session)
            ?.events,
      eventHours: attendanceSchema.find((schema) => schema.name === att.session)
        ?.eventHours,
      hours: attendanceSchema.find((schema) => schema.name === att.session)
        ?.hours,
    }));
    loading.value = false;

    if (hoursDone.value >= 25 * 0.8) {
      await until(isMounted).toBe(true);
      const canvas = document.getElementsByClassName('canvas-confetti')[0];
      //@ts-expect-error I am sure canvas will not be null
      const con = confetti.create(canvas, { resize: true });

      con({
        particleCount: 250,
        spread: 45,
        origin: { y: 1 },
        gravity: 0.5,
        startVelocity: 60,
        colors: ['#24272A', '#34B6ED', '#70C1B3', '#FFE066', '#E8451E'],
      });
    }
  } else {
    logger.error(
      'attendance:main',
      'error when loading attendance data from supabase',
      { data, error }
    );
  }
};
main();

const certButtons = computedEager(() => {
  const buts: ActionSheetButton[] = [];
  if (hoursDone.value >= 25 * 0.8) {
    buts.push({
      text: 'Asistencia',
      icon: stopwatchOutline,
      handler: () => {
        if (hoursDone.value >= 25 * 0.8) {
          // TODO Share cert
        }
      },
    });
  }
  if ((user.value as WPUser).acf.has_poster)
    buts.push({
      text: 'Póster',
      icon: imageOutline,
      handler: () => {
        if (isBefore(new Date(), new Date(2023, 6, 21, 23, 59, 59))) return; // TODO Show some alert or toast saying that it is only available after the congress itself
        if ((user.value as WPUser).acf.has_poster) {
        } // Share here
      },
    });
  return buts;
});

const downloadCerts = () => {
  actionSheetController
    .create({
      header: 'Seleccionar certificado',
      subHeader: 'Elige el certificado que deseas descargar',
      buttons: [
        ...certButtons.value,
        {
          text: 'Cancelar',
          icon: closeOutline,
          cssClass: 'cancel-button',
        },
      ],
    })
    .then((sheet) => sheet.present());
};

// // TODO Add loading
// const main = async () => {
//   if (!connected.value) return;
//   const tmpItems: DocumentData[] = [];
//   // const querySnapshot = await getDocs(collection(firestore, props.dni));
//   const querySnapshot = [
//     {
//       id: 0,
//       data: () => ({}),
//     },
//   ];
//   querySnapshot.forEach((doc) => {
//     console.log(`DOCSSSS: ${doc.id} => ${doc.data()}`);
//     tmpItems.push(doc.data());
//   });
//   tmpItems.sort((a, b) => (Date.parse(a.time) < Date.parse(b.time) ? -1 : 1));
//   items.value = removeDuplicates(tmpItems);
//   loading.value = false;
//   console.log(items.value);
//   if (hoursDone.value >= 25 * 0.8) {
//     const canvas = document.getElementsByClassName('canvas-confetti')[0];
//     //@ts-expect-error I am sure canvas will not be null
//     const con = confetti.create(canvas, { resize: true });

//     con({
//       particleCount: 250,
//       spread: 45,
//       origin: { y: 1 },
//       gravity: 0.5,
//       startVelocity: 60,
//       colors: ['#24272A', '#34B6ED', '#70C1B3', '#FFE066', '#E8451E'],
//     });
//   }
// };

// Network.addListener('networkStatusChange', (status) => {
//   connected.value = status.connected;
//   main();
// });

// onMounted(main);
</script>

<style scoped>
.circ-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem 0rem;
  padding: 0rem 3rem;
  gap: 1rem;
}
.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 1rem;
}

.confetti-canvas {
  position: absolute;
  z-index: 99;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
</style>

<style>
.cancel-button {
  color: var(--ion-color-danger) !important;
}

.cancel-button * {
  color: var(--ion-color-danger) !important;
}
</style>
