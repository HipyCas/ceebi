<template>
  <ion-page>
    <Header />
    <ion-content class="h-max">
      <h1 class="ion-margin-top title font-bold text-4xl">
        {{ $t('settings.title') }}
      </h1>
      <PlainLoading
        v-if="loadingUser"
        :text="`${$t('auth.loggingIn')}...`"
        class="my-10"
      />
      <div class="mx-5 my-3 flex flex-row items-center" v-else-if="user">
        <IonAvatar class="mr-3">
          <img :src="user.avatar_urls['96']" />
        </IonAvatar>
        <div class="flex-grow">
          <p class="text-xl font-semibold">{{ user.name }}</p>
          <p class="text-sm font-light">{{ user.email }}</p>
          <ion-button
            expand="block"
            size="small"
            fill="outline"
            color="secondary"
            @click="logout"
            >{{ $t('auth.logout') }}</ion-button
          >
        </div>
      </div>
      <div v-else class="px-5 my-3">
        <IonText class="font-[500] text-lg text-center"
          >Inicia sesión para poder registrar tu asistencia y ver notificaciones
          exclusivas para asistentes</IonText
        >
        <ion-button
          router-link="/auth/login"
          @click="logNavigation('login')"
          expand="block"
          class="mt-2"
          >¡Inicia sesión!</ion-button
        >
      </div>
      <!--* INTERFACE *-->
      <ion-card class="first-card">
        <ion-card-header
          ><ion-card-title>
            {{ $t('settings.interfaceTitle') }}
          </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <!--* Locale *-->
          <ion-item lines="inset">
            <ion-select
              v-model="$i18n.locale"
              interface="popover"
              :label="$t('settings.localeSelection')"
              @ion-change="saveLocale($event)"
            >
              <ion-select-option
                v-for="locale in $i18n.availableLocales.sort((a, b) =>
                  getLocaleName(a).localeCompare(getLocaleName(b))
                )"
                :key="`locale-${locale}`"
                :value="locale"
                >{{ getLocaleName(locale) }}</ion-select-option
              >
            </ion-select>
          </ion-item>
          <!--* Translate schedule *-->
          <ion-item
            lines="inset"
            button
            :detail="false"
            :disabled="$i18n.locale === 'es'"
          >
            <ion-toggle v-model="translateSchedule"
              >Traducir horario</ion-toggle
            >
          </ion-item>
          <!--* Dark Mode *-->
          <ion-item lines="inset" button :detail="false">
            <ion-toggle v-model="darkMode">{{
              $t('settings.darkMode')
            }}</ion-toggle>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <!--** EVENT NOTIFICATIONS **-->
      <ion-card>
        <ion-card-header
          ><ion-card-title>
            {{ $t('settings.notificationsTitle') }}
          </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <!--* Toggle Local event notifications *-->
          <ion-item lines="inset" button :detail="false">
            <ion-toggle v-model="eventRemindersOn">{{
              $t('settings.eventRemindersToggle')
            }}</ion-toggle>
          </ion-item>
          <!--* Time before event selection *-->
          <ion-item lines="inset" class="item">
            <ion-select
              v-model="eventRemindersTime"
              interface="popover"
              :disabled="!eventRemindersOn"
              :label="$t('settings.eventRemindersChooseTime')"
            >
              <ion-select-option value="0">{{
                $t('settings.eventsRemindersTime0')
              }}</ion-select-option>
              <ion-select-option
                v-for="time in [1, 3, 5, 10, 15, 20, 30, 45, 60]"
                :key="time"
                :value="time"
                >{{ time }} {{ $t('settings.minutes') }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <!--* HELP *-->
      <ion-card>
        <ion-card-header
          ><ion-card-title> Ayuda </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <!--* Link to web *-->
          <ion-item
            lines="inset"
            href="https://biociencias.es/app"
            :detail="false"
            @click="logEvent(analytics, 'open_appPage')"
          >
            Preguntas frecuentes y más info
            <IonIcon slot="end" :icon="openOutline"></IonIcon>
          </ion-item>
          <!--* Share logs *-->
          <ion-item
            @click="preshareLogs()"
            lines="inset"
            :detail="false"
            button
            class="item"
          >
            Compartir registro de errores
            <IonIcon slot="end" :icon="paperPlaneOutline"></IonIcon>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-button
        router-link="/slides"
        @click="logNavigation('slides')"
        fill="clear"
        expand="full"
      >
        Ver introducción de nuevo
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonIcon,
  IonText,
  IonButton,
  useIonRouter,
  SelectCustomEvent,
  IonAvatar,
  alertController,
} from '@ionic/vue';
import {
  alertCircleOutline,
  openOutline,
  paperPlaneOutline,
} from 'ionicons/icons';
import Header from '../components/Header.vue';
import * as locales from 'locale-codes';
import {
  KEY_LOCALE,
  KEY_DARK_MODE,
  KEY_TRANSLATE_SCHEDULE,
  KEY_EVENTS_NOTIFICATIONS,
  KEY_EVENTS_NOTIFICATIONS_TIME,
} from '../vars';
import { toggleDarkMode } from '../ui';
import { getDarkMode, isDarkMode, setDarkMode } from '../darkMode';
import { getUser, loadingUser } from '../user';
import { clearWPToken } from '../wpauth';
import { shareLogs, PlainLoading } from '@code/ceebi-ui';
import { getTranslateSchedule } from '../translateSchedule';
import { logCatchError } from '@code/capacitor-utils';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { useI18n } from 'vue-i18n';
import { analytics } from '../firebase';
import { logEvent, setUserProperties } from 'firebase/analytics';
import { useEventReminders } from '../eventReminders';

const router = useIonRouter();
const { locale, t } = useI18n({ useScope: 'global' });
const logger = useLogger();

const user: Ref<WPUser> = getUser();

const preshareLogs = async () => {
  const alert = alertController.create({
    header: 'Compartir registro de errores',
    message:
      'Comparte este archivo con los desarrolladores de la aplicación via correo a app@biociencias.es o por Telegram a @HipyCas para que se revisen y se intenten arreglar los problemas que hayan surgido',
    buttons: [
      {
        text: t('ui.cancel'),
        role: 'cancel',
      },
      {
        text: t('ui.send'),
        handler: () => {
          shareLogs(logger, 'ceebiclient', {
            dialogTitle: 'Comparte este archivo con la organización',
            title: 'Logs aplicación CEEBI',
          }).catch((e) =>
            useToast({
              message: 'error when sharing notifications:' + e,
              color: 'danger',
            })
          );
        },
      },
    ],
  });
  (await alert).present();
};

const logout = () => {
  clearWPToken();
  useToast({
    message: 'Sesión cerrada con éxito',
    color: 'success',
  });
  logEvent(analytics, 'logout');
  router.push('/auth/login');
};

const logNavigation = (to: string) => logEvent(analytics, `navigate_${to}`);

const saveLocale = async (ev: SelectCustomEvent) => {
  try {
    if (ev.detail.value === 'es') translateSchedule.value = false;
    // logger.trace('settings:saveLocale', `Updating locale to ${locale}`);
    // locale = ev.detail.value;
    logger.info('settings:saveLocale', `Updated locale to ${ev.detail.value}`, {
      key: KEY_LOCALE,
      event: ev,
      locale,
    });
    await Preferences.set({
      key: KEY_LOCALE,
      value: ev.detail.value,
    });
  } catch (e) {
    useToast({
      message: 'Error al guardar el idioma',
      color: 'danger',
      icon: alertCircleOutline,
    });
    logger.error(
      'settings:saveLocale',
      `error when updating locale to ${ev.detail.value} from ${locale.value}`,
      { error: e, event: ev, locale }
    );
    FirebaseCrashlytics.setContext({
      key: 'i18n.locale',
      type: 'string',
      value: typeof locale.value === 'string' ? locale.value : 'ERROR',
    });
    FirebaseCrashlytics.setContext({
      key: 'eventValue',
      type: 'string',
      value: ev.detail.value,
    });
    logCatchError(
      logger,
      'settings:saveLocale',
      `error when updating locale to ${ev.detail.value} from ${locale.value}`,
      e,
      false
    );
  }
};

const getLocaleName = (tag: string): string => locales.getByTag(tag).name;

const translateSchedule = getTranslateSchedule();

watch(translateSchedule, (translate) =>
  Preferences.set({
    key: KEY_TRANSLATE_SCHEDULE,
    value: translate ? 'true' : 'false',
  })
);

const darkMode = ref(getDarkMode());

watch(darkMode, (val) => {
  logger.info('setup:watch(darkMode)', `Update dark mode to ${val}`, {
    key: KEY_DARK_MODE,
    watchValue: val,
    refValue: darkMode.value,
  });
  toggleDarkMode(val);
  setDarkMode(val);
  Preferences.set({
    key: KEY_DARK_MODE,
    value: val.toString(),
  });
  setUserProperties(analytics, {
    darkModeOn: val,
  });
}); // TODO Not properly loading or saving value

watch(isDarkMode, (val) => (darkMode.value = val));

const [eventRemindersOn, eventRemindersTime] = useEventReminders();

watch(eventRemindersOn, (value) => {
  setUserProperties(analytics, {
    eventRemindersOn: value,
  });
  Preferences.set({
    key: KEY_EVENTS_NOTIFICATIONS,
    value: value ? 'true' : 'false',
  });
});

// Esto no lo está guardando en preferences, por eso no funcionaba xd
watch(eventRemindersTime, (value) => {
  setUserProperties(analytics, {
    eventRemindersTime: value,
  });
  Preferences.set({
    key: KEY_EVENTS_NOTIFICATIONS_TIME,
    value: value.toString(),
  });
});
</script>

<style scoped>
ion-content.ios .title {
  /* position: absolute !important; */
  text-align: center;
}

ion-content.md .title {
  margin-left: 1rem;
}

ion-label {
  white-space: normal !important;
}

ion-item.ios {
  --background: var(--ion-card-background);
}
</style>
