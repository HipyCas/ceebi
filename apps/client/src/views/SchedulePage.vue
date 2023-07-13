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
          <ion-label>M 18</ion-label>
        </ion-segment-button>
        <ion-segment-button value="3">
          <ion-label>X 19</ion-label>
        </ion-segment-button>
        <ion-segment-button value="4">
          <ion-label>J 20</ion-label>
        </ion-segment-button>
        <ion-segment-button value="5">
          <ion-label>V 21</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
    <ion-content :fullscreen="true">
      <NoConnection v-if="!connected">
        {{ $t('message.scheduleGoOnline') }}
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
            <Timeline v-else :events="tuesdayEvents"
              >Martes</Timeline
            > </swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="wednesdayLoading"></SkeletonTimeline>
            <Timeline v-else :events="wednesdayEvents"
              >Miercoles</Timeline
            ></swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="thursdayLoading"></SkeletonTimeline
            ><Timeline v-else :events="thursdayEvents"
              >Jueves</Timeline
            > </swiper-slide
          ><swiper-slide class="slide">
            <SkeletonTimeline v-if="fridayLoading"></SkeletonTimeline
            ><Timeline v-else :events="fridayEvents"
              >Viernes</Timeline
            ></swiper-slide
          >
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

import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { useI18n } from 'vue-i18n';
import { Translation, Language } from '@capacitor-mlkit/translation';
import * as locales from 'locale-codes';
import { MEC } from '@code/mec-ts';
import { getTranslateSchedule } from '../translateSchedule';

import { Event } from '@code/mec-ts';

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
// // Get thursday events
const tuesdayEvents = ref([] as Event[]);
const tuesdayLoading = ref(true);

// // Get wednesday events
const wednesdayEvents = ref([] as Event[]);
const wednesdayLoading = ref(true);

// // Get thursday events
const thursdayEvents = ref([] as Event[]);
const thursdayLoading = ref(true);

// // Get friday events
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

const loadEvents = async () => {
  logger.trace('schedule:loadEvents', 'load MEC');
  const mec = await MEC.init(
    'https://biociencias.es/wp-json/mecexternal/v1/calendar/5518'
  );

  logger.trace('schedule:loadEvents', {
    localeStr: locale.toString(),
    // localeJSON: JSON.stringify(locale),
  });

  const shouldTranslate =
    locale.toString() !== 'es' &&
    isPlatform('capacitor') &&
    translateSchedule.value;
  const tmpTuesdayEvents = mec.get('2023-07-18');
  if (shouldTranslate) {
    console.info('[EVENTS TRANSLATE] translate tuesday');
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
    console.info('[EVENTS TRANSLATE] translate wednesday');
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

  currentLanguage = locale.toString();
};
loadEvents();

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

if (isPlatform('capacitor')) {
  console.trace('schedule:setup', 'creating localNotifications channel');
  LocalNotifications.createChannel({
    id: 'testchannel',
    name: 'Event reminders',
    importance: 3,
    vibration: true,
  })
    .then(() => {
      Preferences.get({ key: 'localNotifications' }) // It is of the form wants;registered
        .then(({ value }) => {
          const split = (value == undefined ? 'false;false' : value).split(';');
          const wants = split[0] == 'true';
          const registered = split[1] == 'true';
          if (wants && !registered) {
            tuesdayEvents.value.forEach((event: any) => {
              LocalNotifications.checkPermissions().then((check) => {
                if (check.display === 'granted') {
                  LocalNotifications.schedule({
                    notifications: [
                      {
                        title: `${event.name} empizeza en 10 minutos!`,
                        body: `El evento ${event.name} va a empezar en 10 minutos en ${event.location}`,
                        id: Number(event.startTime.toUTCString()),
                      },
                    ],
                  });
                } else {
                  console.warn('Schedule:121 > Permissions not granted');
                }
              });
            });
            Preferences.set({
              key: 'localNotifications',
              value: 'true;true',
            });
          } else {
            logger.trace(
              'schedule:setNotifications',
              'Notifications set, take a look: ',
              LocalNotifications.getPending()
            );
          }
        });
    })
    .catch((e) => console.warn('Schedule:134 > error creating channel', e));
}

function segmentChanged(event: CustomEvent): void {
  console.log('Segment changed: ', event);
  console.info(day);
  swiper.value.slideTo(day.value - 2, 300);
}

const swiperModules = [IonicSlides];

onIonViewWillEnter(() => {
  // TODO Check also preference for translating schedule
  if (
    locale.toString() !== 'es' &&
    isPlatform('capacitor') &&
    locale !== currentLanguage &&
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
