<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ $t('attendance.attendance') }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{ $t('ui.close') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <no-connection v-if="!connected">
      {{ $t('attendance.attendanceConnectToSee') }}
    </no-connection>

    <div v-else-if="loading" class="wrapper">
      <PlainLoading :spinner-tailwind-size="10"></PlainLoading>
    </div>

    <template v-else-if="items.length > 0">
      <canvas class="confetti-canvas"></canvas>
      <div class="circ-wrapper">
        <div class="relative block">
          <circle-progress
            class="!w-[30vw] !h-[30vw]"
            :percent="Math.round((Math.min(25, hoursDone) / 25) * 100)"
            :is-gradient="true"
            :gradient="{
              angle: 125,
              startColor: style.getPropertyValue('--ion-color-primary'),
              stopColor: style.getPropertyValue('--ion-color-secondary'),
            }"
            circle-color="transparent"
            :border-width="17"
            empty-color="#00000000"
          >
          </circle-progress>
          <span style="font-size: 24px" class="absolute top-[33%] left-[32%]">
            {{ Math.round((Math.min(25, hoursDone) / 25) * 100) }}%
          </span>
        </div>
        <span style="font-size: 20px; font-weight: 500">
          {{ $t('attendance.youveAssistedTo') }} {{ hoursDone }}
          {{ $t('attendance.outOfTotalOf') }}
        </span>
      </div>
      <div class="grid place-items-center py-2">
        <div @click="downloadCerts">
          <IonButton
            :size="canDownloadCertificates ? 'large' : undefined"
            :disabled="!canDownloadCertificates"
            :color="canDownloadCertificates ? 'success' : 'medium'"
            >{{ $t('attendance.downloadCertificates') }}</IonButton
          >
        </div>
      </div>
      <ion-list>
        <ion-list-header class="text-lg underline">
          {{ $t('attendance.eventsYouveAssisted') }}
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
      <span>{{ $t('attendance.noAttendance') }}</span>
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
  IonItem,
  IonList,
  IonListHeader,
  modalController,
  actionSheetController,
  loadingController,
} from '@ionic/vue';
import type { ActionSheetButton } from '@ionic/vue';
import confetti from 'canvas-confetti';
import NoConnection from './NoConnection.vue';
//@ts-expect-error vue3-circle-progress has no support for TypeScript
import CircleProgress from 'vue3-circle-progress';
import { getUser } from '../user';
import type _attendanceSchema from '../../attendance.json';
import parseISO from 'date-fns/parseISO';
import { until, useMounted } from '@vueuse/core';
import {
  imageOutline,
  stopwatchOutline,
  closeOutline,
  alertCircleOutline,
  schoolOutline,
  hourglassOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import isAfter from 'date-fns/isAfter';
import { PlainLoading } from '@code/ceebi-ui';
import type { WPUser } from '@code/wp-types';
import { logCatchError, logPostgrestError } from '@code/capacitor-utils';
import { MICROCURSOS_DOS_DIAS } from '../vars';

const { t } = useI18n();
const supabase = useSupabase();
const logger = useLogger();

const user: Ref<WPUser> = getUser();
const isMounted = useMounted();

const style = getComputedStyle(document.body);

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

const microRegEx = /^Microcurso "([\w\sáóéíú:(),¿?.ñ¡!\-\/“”–]+)"$/m;
const microcursosDone = computed(() =>
  items.value
    .flatMap((item) => item.events)
    .filter((ev) => microRegEx.test(ev ?? ''))
    .map((ev) => (microRegEx.exec(ev as string) as RegExpExecArray)[1] ?? ev)
    .map(
      (ev, _, arr) =>
        [ev, arr.filter((thisCourse) => thisCourse === ev).length] as [
          string,
          number
        ]
    )
    .filter(
      ([ev, times]) => !(MICROCURSOS_DOS_DIAS.includes(ev) && times !== 2)
    )
    .map(([ev]) => ev)
    .filter((ev, pos, self) => self.indexOf(ev) === pos)
);

const dismissModal = () => modalController.dismiss();

(async () => (connected.value = (await Network.getStatus()).connected))();

const hoursDone = computed(
  () =>
    items.value
      .map((item) => item.hours)
      .reduce((prev, curr) => (prev ?? 0) + (curr ?? 0), 0) as number
);

const canDownloadCertificates = computed(
  () =>
    isAfter(new Date(), new Date(2023, 6, 21, 19, 35)) &&
    (hoursDone.value >= 25 * 0.8 ||
      user.value.acf.has_poster ||
      microcursosDone.value.length > 0)
);

const main = async () => {
  const { data: fileURL } = await supabase.storage
    .from('config')
    .getPublicUrl('attendance.json');

  let attendanceSchema:
    | typeof _attendanceSchema
    | {
        error: string;
        message: string;
        statusCode: string;
      };

  try {
    const res = await fetch(fileURL.publicUrl);
    attendanceSchema = await res.json();
    // @ts-expect-error This checks if there is an error
    if (attendanceSchema['error']) {
      logger.error(
        'attendanceModal:main',
        'http error when fetching attendance',
        { data: attendanceSchema }
      );
      FirebaseCrashlytics.setContext({
        key: 'error',
        type: 'string',
        // @ts-expect-error If it is an error, this will exist
        value: attendanceSchema['error'],
      });
      FirebaseCrashlytics.setContext({
        key: 'message',
        type: 'string',
        // @ts-expect-error If it is an error, this will exist
        value: attendanceSchema['message'],
      });
      FirebaseCrashlytics.setContext({
        key: 'statusCode',
        type: 'string',
        // @ts-expect-error If it is an error, this will exist
        value: attendanceSchema['statusCode'],
      });
      FirebaseCrashlytics.setContext({
        key: 'response',
        type: 'string',
        value: JSON.stringify(attendanceSchema),
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
      message: t('attendance.errorObtainingAttendance'),
      color: 'danger',
      icon: alertCircleOutline,
      cssClass: undefined,
    });
    return;
  }

  logger.trace('attendanceModal:main', 'loaded attendance schema', {
    schema: attendanceSchema,
  });

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('attendant_id', user.value.acf.id_base_de_datos_app);

  if (!error && data) {
    items.value = data?.map((att) => ({
      time: parseISO(att.date || ''),
      events: att.event
        ? [att.event]
        : (attendanceSchema as typeof _attendanceSchema).find(
            (schema) => schema.name === att.session
          )?.events,
      eventHours: (attendanceSchema as typeof _attendanceSchema).find(
        (schema) => schema.name === att.session
      )?.eventHours,
      hours: (attendanceSchema as typeof _attendanceSchema).find(
        (schema) => schema.name === att.session
      )?.hours,
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
    logPostgrestError(
      'attendance:main',
      'error when loading attendance data from supabase',
      data,
      error
    );
    useToast({
      message: t('attendance.errorObtainingAttendance'),
      color: 'danger',
      icon: alertCircleOutline,
      cssClass: undefined,
    });
  }
};
main();

const certButtons = () => {
  const fetchCertificate: (url: string) => Promise<string> = (url) =>
    new Promise((resolve, reject) =>
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        })
        .catch((e) => reject(e))
    );

  const parseMicrocurso = (it: string) => {
    const split = it.split('/');
    const name = split
      .slice(1)
      .join('/')
      .replace(/[áóéíú:(),¿?.ñ¡!\-\/“”– ]/g, '_');
    console.info('transformed', split, name);
    return split[0] + '/' + name;
  };

  const shareCertificate = async (name: string) => {
    try {
      actionSheetController.dismiss();
      const generatingOverlay = await loadingController.create({
        message: `${t('attendance.generatingCertificate')}...`,
      });
      generatingOverlay.present();

      // const { data } = supabase.storage
      //   .from('certificates')
      //   .getPublicUrl(
      //     (name.startsWith('microcursos/') ? parseMicrocurso(name) : name) +
      //       '/' +
      //       user.value.acf.id_base_de_datos_app +
      //       '.pdf'
      //   );

      const data = {
        publicUrl:
          'https://ceebi.wupp.dev/api/ceebi-ii/certificado/' +
          (name.startsWith('microcurso/') ? parseMicrocurso(name) : name) +
          '/' +
          user.value.acf.id_base_de_datos_app +
          '.pdf',
      };

      //* Prefetch to check file exists
      // Get prefetch data as text
      console.log(
        'PREFETCH',
        data.publicUrl,
        await (await fetch(data.publicUrl)).text()
      );
      let prefetchText;
      try {
        FirebaseCrashlytics.addLogMessage({
          message: 'executing pre-download request to check if file exists',
        });
        prefetchText = await (await fetch(data.publicUrl)).text();
      } catch (e) {
        useToast({
          // TODO Translate
          message: 'Error interno, ha sido registrado',
          color: 'danger',
          icon: alertCircleOutline,
          cssClass: undefined,
        });
        FirebaseCrashlytics.setContext({
          key: 'certificateName',
          type: 'string',
          value: name,
        });
        FirebaseCrashlytics.setContext({
          key: 'url',
          type: 'string',
          value: data.publicUrl,
        });
        logCatchError(
          logger,
          'attendanceModal:shareCertificate',
          'error with certificate prefetch',
          e
        );
        generatingOverlay.dismiss();
        return;
      }
      // Try parsing prefetch data and check errors
      let prefetchData;
      try {
        prefetchData = JSON.parse(prefetchText);
      } catch (e) {
        logger.info(
          'attendanceModal:shareCertificate',
          'prefetch data is not JSON, therefore it must be the pdf',
          { error: e, res: prefetchText }
        );
      }

      if (prefetchData?.error) {
        logger.error(
          'attendanceModal:shareCertificate',
          'error when getting certificate'
        );
        //! This is a relaxed comparison
        if (prefetchData.statusCode == '404') {
          useToast({
            message: t('attendance.errorCertificateNotFound'),
            color: 'danger',
            icon: closeCircleOutline,
            cssClass: undefined,
          });
          generatingOverlay.dismiss();
          return;
        } else {
          useToast({
            // TODO Translate
            message: 'Error interno, ha sido registrado',
            color: 'danger',
            icon: alertCircleOutline,
            cssClass: undefined,
          });
          logger.error(
            'attendanceModal:shareCertificate',
            'internal error while fetching certificate',
            {
              resText: prefetchText,
              resJSON: prefetchData,
              url: data.publicUrl,
              certificateName: name,
            }
          );
          FirebaseCrashlytics.setContext({
            key: 'error',
            type: 'string',
            value: prefetchData.error,
          });
          FirebaseCrashlytics.setContext({
            key: 'statusCode',
            type: 'string',
            value: prefetchData.statusCode,
          });
          FirebaseCrashlytics.setContext({
            key: 'message',
            type: 'string',
            value: prefetchData.message,
          });
          FirebaseCrashlytics.setContext({
            key: 'url',
            type: 'string',
            value: data.publicUrl,
          });
          FirebaseCrashlytics.setContext({
            key: 'certificateName',
            type: 'string',
            value: name,
          });
          StackTrace.fromError(
            new Error('internal error while fetching certificate')
          ).then((stacktrace) =>
            FirebaseCrashlytics.recordException({
              stacktrace,
              message: 'internal error while fetching certificate',
            })
          );
        }
        generatingOverlay.dismiss();
        return;
      }

      let dataUri;
      try {
        FirebaseCrashlytics.addLogMessage({
          message: 'fetching certificate blob as base64 url',
        });
        dataUri = await fetchCertificate(data.publicUrl);
        logger.trace(
          'attendanceModal:shareCertificate',
          'fetched certificate and got dataUri',
          dataUri
        );
      } catch (e) {
        logCatchError(
          logger,
          'attendanceModal:shareCertificate',
          'error when obtaining certificate',
          e
        );
        useToast({
          message: t('attendance.errorCertificateNotFound'),
          color: 'danger',
          icon: alertCircleOutline,
          cssClass: undefined,
        });
        generatingOverlay.dismiss();
        return;
      }

      FirebaseCrashlytics.addLogMessage({
        message: 'going to write pdf to cache for share',
      });
      const pdf = await Filesystem.writeFile({
        path: `CEEBI ${
          name === 'attendance'
            ? 'Asistencia'
            : name === 'poster'
            ? 'Poster'
            : 'Microcurso ' + name.split('/').slice(1).join('/')
        } Certificado.pdf`,
        data: dataUri,
        directory: Directory.Cache,
      });
      logger.trace(
        'attendanceModal:shareCertificate',
        'temporally saved certificate to disk',
        pdf.uri
      );
      generatingOverlay.dismiss();
      Share.share({
        files: [pdf.uri],
      });
    } catch (error) {
      loadingController.dismiss();
      logCatchError(
        logger,
        `attendanceModal:shareCertificate(${name})`,
        `(generic try catch) error when fetching and sharing ${name} certificate: ${error}`,
        error
      );
      useToast({
        message: t('attendance.errorGeneratingCertificate'),
        color: 'danger',
        icon: alertCircleOutline,
        cssClass: undefined,
      });
    }
  };

  const buts: ActionSheetButton[] = [];
  if (hoursDone.value >= 25 * 0.8)
    buts.push({
      text: t('attendance.selectCertificateButtonAttendance'),
      icon: stopwatchOutline,
      handler: () => {
        FirebaseCrashlytics.addLogMessage({
          message: 'handling attendance certificate download',
        });
        if (hoursDone.value >= 25 * 0.8) {
          shareCertificate('asistencia');
        }
      },
    });

  if (user.value.acf.has_poster)
    buts.push({
      text: t('attendance.selectCertificateButtonPoster'),
      icon: imageOutline,
      handler: () => {
        FirebaseCrashlytics.addLogMessage({
          message: 'handling poster certificate download',
        });
        if ((user.value as WPUser).acf.has_poster) {
          shareCertificate('poster');
        }
      },
    });

  if (microcursosDone.value.length > 0) {
    console.log(
      microcursosDone.value,
      microcursosDone.value.map((mic) =>
        mic.replace(/\//g, '__').replace(/[áóéíú:(),¿?.ñ¡!\-\/“”–]/g, '_')
      )
    );
    buts.push({
      text: t('attendance.selectCertificateButtonMicrocourses'),
      icon: schoolOutline,
      handler: () =>
        actionSheetController
          .create({
            header: t('attendance.selectCertificateSelectMicrocourse'),
            buttons: [
              ...microcursosDone.value.map((ev) => ({
                text: ev,
                handler: () => shareCertificate(`microcurso/${ev}`),
              })),
              {
                text: t('ui.cancel'),
                icon: closeOutline,
                cssClass: 'cancel-button',
              },
            ],
          })
          .then((act) => act.present()),
    });
  }

  return buts;
};

const downloadCerts = () => {
  if (!canDownloadCertificates.value)
    useToast({
      message: t('attendance.availableWhenEventFinished'),
      icon: hourglassOutline,
      cssClass: undefined,
    });
  else
    actionSheetController
      .create({
        header: t('attendance.selectCertificateHeader'),
        subHeader: t('attendance.selectCertificateSubheader'),
        buttons: [
          ...certButtons(),
          {
            text: t('ui.cancel'),
            icon: closeOutline,
            cssClass: 'cancel-button',
          },
        ],
      })
      .then((sheet) => sheet.present());
};
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
