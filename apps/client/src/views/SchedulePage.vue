<template>
  <ion-page>
    <Header id="header" />
    <!-- Date selection -->
    <ion-toolbar class="border-b" v-if="connected">
      <ion-segment
        _mode="ios"
        v-model="day"
        @ionChange="segmentChanged($event)"
      >
        <ion-segment-button value="2">
          <ion-label>{{ $t('schedule.tabs.tuesday') }} 18</ion-label>
        </ion-segment-button>
        <ion-segment-button value="3">
          <ion-label>{{ $t('schedule.tabs.wednesday') }} 19</ion-label>
        </ion-segment-button>
        <ion-segment-button value="4"
          >git
          <ion-label>{{ $t('schedule.tabs.thursday') }} 20</ion-label>
        </ion-segment-button>
        <ion-segment-button value="5">
          <ion-label>{{ $t('schedule.tabs.friday') }} 21</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
    <ion-content :fullscreen="true">
      <NoConnection v-if="!connected">
        {{ $t('schedule.goOnline') }}
      </NoConnection>
      <div class="swiper" v-else>
        <Swiper
          class="swiper"
          @swiper="setSwiperInstance"
          @slideChange="daySwiped"
          :modules="swiperModules"
          :auto-height="true"
          :grab-cursor="true"
        >
          <swiper-slide class="slide"
            ><SkeletonTimeline v-if="tuesdayLoading"></SkeletonTimeline>
            <Timeline v-else :events="tuesdayEvents"></Timeline> </swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="wednesdayLoading"></SkeletonTimeline>
            <Timeline v-else :events="wednesdayEvents"></Timeline></swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="thursdayLoading"></SkeletonTimeline
            ><Timeline
              v-else
              :events="thursdayEvents"
            ></Timeline> </swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="fridayLoading"></SkeletonTimeline
            ><Timeline v-else :events="fridayEvents"></Timeline
          ></swiper-slide>
        </Swiper>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import 'swiper/css';
import {
  IonPage,
  IonContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonicSlides,
  isPlatform,
  onIonViewWillEnter,
} from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import Header from '../components/Header.vue';
import Timeline from '../components/Timeline.vue';
import SkeletonTimeline from '../components/SkeletonTimeline.vue';
import NoConnection from '../components/NoConnection.vue';

import { LocalNotifications } from '@capacitor/local-notifications';
import { Translation, Language } from '@capacitor-mlkit/translation';
import * as locales from 'locale-codes';
import { MEC } from '@code/mec-ts';
import { getTranslateSchedule } from '../translateSchedule';
import { logCatchError } from '@code/capacitor-utils';
import subMinutes from 'date-fns/subMinutes';

import { Event } from '@code/mec-ts';
import {
  KEY_EVENTS_NOTIFICATIONS,
  KEY_EVENTS_NOTIFICATIONS_TIME,
} from '../vars';

const { locale } = useI18n();
let currentLanguage: string;

const logger = useLogger();

const translateSchedule = getTranslateSchedule();

const _today = new Date().getTime();
const _first = new Date(2023, 6, 18).getTime();
const _lastPlus = new Date(2023, 6, 22).getTime();

function today(): number {
  const day = new Date().getDay();
  return day < 2 || day > 5 || _today <= _first || _today >= _lastPlus
    ? 2
    : day;
}

const swiper = ref();
const setSwiperInstance = (_swiper: any) => {
  logger.info(
    'schedule:setSwiperInstance',
    'setting swipper instance',
    _swiper
  );
  swiper.value = _swiper;
  _swiper.slideTo(today() - 2, 300);
};

const day = ref(today().toString());

function daySwiped() {
  day.value = (swiper.value.activeIndex + 2).toString();
}

watch(day, (val) => console.info('day changed', val));

logger.trace('schedule:setup', 'setup events');

const tuesdayEvents = ref([] as Event[]);
const tuesdayLoading = ref(true);

const wednesdayEvents = ref([] as Event[]);
const wednesdayLoading = ref(true);

const thursdayEvents = ref([] as Event[]);
const thursdayLoading = ref(true);

const fridayEvents = ref([] as Event[]);
const fridayLoading = ref(true);

const translate = async (text: string) => {
  return (
    await Translation.translate({
      text,
      sourceLanguage: Language.Spanish,
      targetLanguage: (Language as Record<string, string>)[
        locales.getByTag(locale.toString()).name
      ] as Language,
    })
  ).text;
};

// #region Load Events
const loadEvents = async () => {
  logger.trace('schedule:loadEvents', 'load MEC');
  const mec = await MEC.init(
    'https://biociencias.es/wp-json/mecexternal/v1/calendar/5518'
  );

  logger.trace('schedule:loadEvents', {
    localeStr: locale.toString(),
    localeValue: locale.value,
    locale,
  });

  const shouldTranslate =
    locale.value !== 'es' && isPlatform('capacitor') && translateSchedule.value;

  if (shouldTranslate) {
    const targetLanguage = (Language as Record<string, string>)[
      locales.getByTag(locale.toString()).name
    ] as Language;
    const languageDownloaded = (
      await Translation.getDownloadedModels()
    ).languages.includes(targetLanguage);
    if (!languageDownloaded) {
      await Translation.downloadModel({
        language: targetLanguage,
      });
    }
  }

  const tmpTuesdayEvents = mec.get('2023-07-18');
  if (shouldTranslate) {
    tmpTuesdayEvents.translate(translate).then((evs) => {
      tuesdayEvents.value = evs.resolve();
      tuesdayLoading.value = false;
    });
  } else {
    tuesdayEvents.value = tmpTuesdayEvents.resolve();
    tuesdayLoading.value = false;
  }

  const tmpWednesdayEvents = mec.get('2023-07-19');
  if (shouldTranslate) {
    tmpWednesdayEvents.translate(translate).then((evs) => {
      wednesdayEvents.value = evs.resolve();
      wednesdayLoading.value = false;
    });
  } else {
    wednesdayEvents.value = tmpWednesdayEvents.resolve();
    wednesdayLoading.value = false;
  }

  const tmpThursdayEvents = mec.get('2023-07-20');
  if (shouldTranslate)
    tmpThursdayEvents.translate(translate).then((evs) => {
      thursdayEvents.value = evs.resolve();
      thursdayLoading.value = false;
    });
  else {
    thursdayEvents.value = tmpThursdayEvents.resolve();
    thursdayLoading.value = false;
  }

  const tmpFridayEvents = mec.get('2023-07-21');
  if (shouldTranslate)
    tmpFridayEvents.translate(translate).then((evs) => {
      fridayEvents.value = evs.resolve();
      fridayLoading.value = false;
    });
  else {
    fridayEvents.value = tmpFridayEvents.resolve();
    fridayLoading.value = false;
  }

  currentLanguage = locale.value;
};
loadEvents();
// #endregion

// #region CONNECTION
const connected = ref(true);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
})();
Network.addListener('networkStatusChange', (status) => {
  connected.value = status.connected;
  if (status) {
    loadEvents();
  }
});
// #endregion

// #region Local Notifications
if (isPlatform('capacitor')) {
  logger.trace('schedule:setup', 'creating localNotifications channel');
  LocalNotifications.createChannel({
    id: 'eventReminders',
    name: 'Event reminders',
    importance: 3,
    vibration: true,
  })
    .then(() => {
      Preferences.get({ key: KEY_EVENTS_NOTIFICATIONS }) // It is of the form wants;registered
        .then(async ({ value }) => {
          const split = (value == undefined ? 'false;false' : value).split(';');
          const wants = split[0] == 'true';
          const registered = split[1] == 'true';
          if (wants && !registered) {
            const { value: timeBeforeRaw } = await Preferences.get({
              key: KEY_EVENTS_NOTIFICATIONS_TIME,
            });
            const timeBefore = Number.parseInt(timeBeforeRaw ?? '0');
            tuesdayEvents.value.forEach((event) => {
              LocalNotifications.checkPermissions().then((check) => {
                if (check.display === 'granted') {
                  LocalNotifications.schedule({
                    notifications: [
                      {
                        title: `${event.title} empizeza en 10 minutos!`,
                        body: `El evento ${event.startTime} va a empezar en 10 minutos en ${event.locations[0]}`,
                        id: event.id,
                        schedule: {
                          at: subMinutes(event.startDate, timeBefore),
                        },
                      },
                    ],
                  });
                } else {
                  logger.warn(
                    'schedule:setNotifications',
                    'Permissions not granted'
                  );
                }
              });
            });
            Preferences.set({
              key: 'localNotifications',
              value: 'true;true',
            });
          } else if (!wants && registered) {
            LocalNotifications.deleteChannel({
              id: 'eventReminders',
            });
            logger.trace('schedule:setNotifications', 'channel deleted');
          } else {
            logger.trace(
              'schedule:setNotifications',
              'Notifications set, take a look: ',
              LocalNotifications.getPending()
            );
          }
        });
    })
    .catch((e) => {
      logCatchError(
        logger,
        'schedule:LocalNotifications.createChannel',
        'error creating notification channel',
        e
      );
    });
}
// #endregion

function segmentChanged(event: CustomEvent): void {
  console.log('Segment changed: ', event);
  console.info(day);
  swiper.value.slideTo(Number.parseInt(day.value) - 2, 300);
}

const swiperModules = [IonicSlides];

onIonViewWillEnter(() => {
  // TODO Check also preference for translating schedule
  if (
    locale.toString() !== 'es' &&
    isPlatform('capacitor') &&
    locale.value !== currentLanguage &&
    translateSchedule.value
  ) {
    loadEvents();
  }
});
</script>

<style scoped>
#header {
  z-index: 50;
}

body.dark .border-b {
  box-shadow: 0px 5px 15px -8px rgba(55, 55, 55, 0.5);
}

.swiper {
  min-height: 100%;
  /* overflow-y: hidden; */
}

.slide {
  min-height: 79.4vh;
  /* min-height: 100%; */
  height: max-content;
}
</style>
