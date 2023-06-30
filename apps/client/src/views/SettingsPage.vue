<template>
  <ion-page>
    <Header />
    <ion-content class="h-max">
      <h1 class="ion-margin-top title font-bold text-4xl">
        {{ $t('message.settingsTitle') }}
      </h1>
      <div class="mx-5 my-3 flex flex-row items-center" v-if="user">
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
            >Cerrar sesión</ion-button
          >
        </div>
      </div>
      <div v-else class="px-5 my-3">
        <IonText class="font-[500] text-lg text-center"
          >Inicia sesión para poder registrar tu asistencia y ver notificaciones
          exclusivas para asistentes</IonText
        >
        <router-link to="/auth/login">
          <ion-button expand="block" class="mt-2">¡Inicia sesión!</ion-button>
        </router-link>
      </div>
      <!-- Interface -->
      <ion-card class="first-card">
        <ion-card-header
          ><ion-card-title>
            {{ $t('message.settingsInterfaceTitle') }}
          </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <ion-item lines="inset">
            <ion-select
              v-model="$i18n.locale"
              interface="popover"
              :label="$t('message.localeSelection')"
              :_value="
                $i18n.locale && $i18n.availableLocales.includes($i18n.locale)
                  ? $i18n.locale
                  : $i18n.fallbackLocale
              "
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
          <div>
            <ion-item lines="inset" button :detail="false">
              <ion-toggle v-model="darkMode">{{
                $t('message.darkMode')
              }}</ion-toggle>
            </ion-item>
          </div>
        </ion-card-content>
      </ion-card>
      <!-- Notifications -->
      <ion-card>
        <ion-card-header
          ><ion-card-title>
            {{ $t('message.settingsNotificationsTitle') }}
          </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <ion-item lines="inset" button :detail="false">
            <ion-toggle v-model="eventRemindersOn">{{
              $t('message.settingsEventRemindersToggle')
            }}</ion-toggle>
          </ion-item>
          <ion-item lines="inset" class="item">
            <ion-select
              v-model="eventRemindersTime"
              interface="popover"
              :disabled="!eventRemindersOn"
              :label="$t('message.settingsEventRemindersChooseTime')"
            >
              <ion-select-option value="0">{{
                $t('message.settingsEventsRemindersTime0')
              }}</ion-select-option>
              <ion-select-option
                v-for="time in [1, 3, 5, 10, 15, 20, 30, 45, 60]"
                :key="time"
                :value="time"
                >{{ time }} {{ $t('message.minutes') }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-header
          ><ion-card-title> Ayuda </ion-card-title></ion-card-header
        >
        <ion-card-content>
          <ion-item
            lines="inset"
            href="https://biociencias.es/app"
            :detail="false"
          >
            Preguntas frecuentes y más info
            <IonIcon slot="end" :icon="openOutline"></IonIcon>
          </ion-item>
          <router-link to="/logs">
            <ion-item lines="inset" button detail class="item"> Logs </ion-item>
          </router-link>
        </ion-card-content>
      </ion-card>
      <ion-button fill="clear" expand="full" @click="router.push('/slides')">
        Ver introducción de nuevo
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonIcon,
  IonText,
  IonButton,
  useIonRouter,
  SelectCustomEvent,
  IonAvatar,
} from '@ionic/vue';
import { openOutline } from 'ionicons/icons';
import Header from '../components/Header.vue';
import * as locale from 'locale-codes';
import { KEY_LOCALE, KEY_DARK_MODE } from '../vars';
import { debug } from '../util';
import { toggleDarkMode } from '../ui';
import { getDarkMode, isDarkMode, setDarkMode } from '../darkMode';
import { getUser } from '../user';
import { clearWPToken } from '../wpauth';

const router = useIonRouter();
const i18n = useI18n();
const logger = useLogger();

const user: Ref<WPUser> = getUser();

const logout = () => {
  clearWPToken();
  useToast({
    message: 'Sesión cerrada con éxito',
    color: 'success',
  });
  link('/auth/login');
};

const link = (to: string) => router.push(to);

const saveLocale = (ev: SelectCustomEvent) => {
  try {
    i18n.locale = ev.detail.value;
  } catch (e) {
    logger.error(
      'settings:saveLocale',
      `error when updating locale to ${ev.detail.value} from ${i18n.locale.value}`,
      { error: e, event: ev, i18n }
    );
  }
  logger.info('settings:saveLocale', `Updated locale to ${ev.detail.value}`, {
    key: KEY_LOCALE,
    event: ev,
    i18n,
  });
  Preferences.set({
    key: KEY_LOCALE,
    value: i18n.locale.value,
  });
};

const getLocaleName = (tag: string): string => locale.getByTag(tag).name;

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
}); // TODO Not properly loading or saving value

watch(isDarkMode, (val) => (darkMode.value = val));

// FIXME This looks like not being saved in device, change that
const eventRemindersOn = ref(false);
const eventRemindersTime = ref(15);

watch(eventRemindersOn, (value) => {
  // setUserProperties(analytics, {
  //   eventRemindersOn: value,
  // });
});

// Esto no lo está guardando en preferences, por eso no funcionaba xd
watch(eventRemindersTime, (value) => {
  // setUserProperties(analytics, {
  //   eventRemindersTime: value,
  // });
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
