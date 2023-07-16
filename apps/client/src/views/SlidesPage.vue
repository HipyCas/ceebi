<template>
  <ion-page>
    <ion-content class="wrap">
      <swiper
        style="height: 100vh; overflow-y: hidden"
        :modules="modules"
        watch-slides-progress
        :pagination="true"
      >
        <swiper-slide>
          <div class="ceebi-img-wrapper">
            <ion-img :src="logo" class="slide-img ceebi-img"></ion-img>
          </div>
          <h1 class="text-2xl font-semibold" style="margin-top: 2rem">
            {{ $t('slides.welcomeTitle') }}
          </h1>
          <ion-text class="slide-text" color="medium">
            {{ $t('slides.welcomeText') }}
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="attendanceSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">{{ $t('slides.attendanceTitle') }}</h2>
          <ion-text class="slide-text" color="medium">
            {{ $t('slides.attendanceText') }}
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="scheduleSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">{{ $t('slides.scheduleTitle') }}</h2>
          <ion-text class="slide-text" color="medium">
            {{ $t('slides.scheduleText') }}
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="newsSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">{{ $t('slides.newsTitle') }}</h2>
          <ion-text class="slide-text" color="medium">
            {{ $t('slides.newsText') }}
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="notificationsSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">{{ $t('slides.notificationsTitle') }}</h2>
          <ion-text class="slide-text" color="medium">
            {{ $t('slides.notificationsText') }}
          </ion-text>
          <IonButton
            class="mt-2"
            @click="askNotificationsPermission"
            :color="notificationPermissionSAuthorized ? 'success' : 'primary'"
          >
            <IonIcon
              v-if="notificationPermissionSAuthorized"
              slot="end"
              :icon="checkmarkOutline"
            ></IonIcon>
            {{ $t('slides.notificationsAllow') }}</IonButton
          >
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="helpSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">{{ $t('slides.helpTitle') }}</h2>
          <ion-text class="slide-text" color="medium">
            Si necesitas cualquier información o ayuda sobre el CEEBI escribe a
            <a href="mailto:info@biociencias.es">info@biociencias.es</a>, o si
            es algún problema o sugerencia de la app a
            <a href="mailto:app@biociencias.es">app@biociencias.es</a>
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <h2>{{ $t('slides.loginTitle') }}</h2>
          <ion-text class="slide-text" color="medium">
            {{ $t('slides.loginText') }}
          </ion-text>

          <LoginForm
            :button-text="$t('slides.loginButton')"
            @login="login"
            @continue="continueToApp"
          ></LoginForm>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import logo from '../../public/assets/Logo CEEBI con fondo.png';
import attendanceSVG from '../../public/assets/attendance.svg';
import scheduleSVG from '../../public/assets/schedule.svg';
import newsSVG from '../../public/assets/news.svg';
import notificationsSVG from '../../public/assets/notifications.svg';
import helpSVG from '../../public/assets/help.svg';

import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { Thumbs, Pagination } from 'swiper';
import '@ionic/vue/css/ionic-swiper.css';

import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  IonContent,
  IonPage,
  IonicSlides,
  IonImg,
  IonText,
  IonButton,
  IonIcon,
  loadingController,
  alertController,
} from '@ionic/vue';

import LoginForm from '../components/LoginForm.vue';
import { checkmarkOutline, closeCircleOutline } from 'ionicons/icons';
import { wpLogin } from '../wpauth';
import { LocalNotifications } from '@capacitor/local-notifications';
import { logCatchError } from '@code/capacitor-utils';

const modules = [Thumbs, Pagination, IonicSlides];

const router = useIonRouter();
const { t } = useI18n();
const logger = useLogger();

const notificationPermissionSAuthorized = ref(false);
const askNotificationsPermission = async () => {
  const response = await LocalNotifications.requestPermissions();
  logger.info(
    'slides:askNotificationsPermission',
    'response to permission request',
    response.display,
    { response }
  );
  if (response.display === 'granted')
    notificationPermissionSAuthorized.value = true;
  else {
    alertController
      .create({
        header: t('slides.notificationsPermissionDenied.header'),
        message: t('slides.notificationsPermissionDenied.message'),
      })
      .then((a) => a.present());
  }
};

const continueToApp = () => {
  Preferences.set({
    key: 'ceebiClient.slidesDone',
    value: 'true',
  });
  router.push('/notifications');
};

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const loading = await loadingController.create({
    message: t('auth.loggingIn'),
  });
  loading.present();

  wpLogin(username, password)
    .then(async () => {
      loading.dismiss();
      continueToApp();
    })
    .catch((e) => {
      logCatchError(logger, 'slides:login', 'error logging in', e);
      loading.dismiss();
      useToast({
        message: t('auth.errorLoggingIn'),
        icon: closeCircleOutline,
        color: 'danger',
      });
    });
};
</script>

<style scoped>
h2 {
  @apply text-2xl font-semibold;
}

.wrap {
  overflow-y: hidden;
}

.swiper-slide {
  display: flex;
  flex-direction: column;
}

.slide-img::part(image) {
  width: 50vw;
}

.slide-header {
  margin-top: 1rem;
}

.slide-text {
  margin-top: 0.25rem;
  width: 75%;
}

.ceebi-img-wrapper {
  background-color: white !important;
  border-radius: 999999px;
  padding: 1em;
}

.ceebi-img::part(image) {
  border-radius: 999999px;
}

.notice {
  margin-top: 0.5rem;
  font-size: 1rem;
  font-style: italic;
}

body .notice {
  color: #ccc;
}

body.dark .notice {
  color: #444;
}

.input-item {
  --background: var(--ion-background-color);
  width: 60%;
}
</style>

<style>
.swiper .swiper-pagination-bullet {
  background-color: hsl(0, 0%, 50%) !important;
}

.swiper .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background-color: var(--ion-color-primary) !important;
}
</style>
