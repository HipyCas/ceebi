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
          <h1 style="margin-top: 2rem">Bienvenido al II CEEBI</h1>
          <ion-text class="slide-text" color="medium">
            Aquí tienes una breve presentación de qué puedes encontrar en esta
            nuestra app oficial
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="attendanceSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">Controla tú asistencia</h2>
          <ion-text class="slide-text" color="medium">
            Acredítate en las actividades, comprueba tú asistencia a todas ellas
            y obtén tú certificado en formato digital diréctamente en tu
            teléfono.
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="scheduleSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">Sigue el horario</h2>
          <ion-text class="slide-text" color="medium">
            Visualiza el horario del CEEBI y obtén más información de todos los
            eventos sin necesidad de acceder a la página web.
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="newsSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">Mantente al día</h2>
          <ion-text class="slide-text" color="medium">
            Accede a todas nuestras noticias desde la propia app, aprendiendo
            sobre biociencias y los últimos sucesos relacionados con el CEEBI.
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="notificationsSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">Entérate de todo</h2>
          <ion-text class="slide-text" color="medium">
            Recibe notificaciones de la organización con la última información y
            actualizaciones y activa los recordatorios de eventos.
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
            Permitir Enviar</IonButton
          >
        </swiper-slide>

        <swiper-slide>
          <ion-img :src="helpSVG" class="slide-img"></ion-img>
          <h2 class="slide-header">¿Necesitas algo más?</h2>
          <ion-text class="slide-text" color="medium">
            Si necesitas cualquier información o ayuda sobre el CEEBI escribe a
            <a href="mailto:info@biociencias.es">info@biociencias.es</a>, o si
            es algún problema o sugerencia de la app a
            <a href="mailto:app@biociencias.es">app@biociencias.es</a>
          </ion-text>
        </swiper-slide>

        <swiper-slide>
          <h2>Empieza con la app</h2>
          <ion-text class="slide-text" color="medium">
            Inicia sesión con tu cuenta del CEEBI (biociencias.es) para poder
            acceder a toda la app
          </ion-text>

          <LoginForm
            button-text="¡Empieza ya!"
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
        header: 'Permiso denegado',
        message:
          'Para poder recibir notificaciones del CEEBI, deberás permitir a la aplicación enviarlas',
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
      loading.dismiss();
      useToast({
        message: 'Error logging in',
        icon: closeCircleOutline,
        color: 'danger',
      });
    });
};
</script>

<style scoped>
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
