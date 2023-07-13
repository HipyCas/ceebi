import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VWave from 'v-wave';

import { IonicVue, alertController } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
/* Theme variables */
import './theme/variables.css';

import './index.css';
import '../../../libs/ceebi-ui/src/common.css';
import 'unfonts.css';

import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { createI18n } from 'vue-i18n';
import * as locale from 'locale-codes';
import { default as messages, SupportedLanguages } from './translations';
import type { Translation } from './translations';
import { KEY_LOCALE, KEY_WP_TOKEN } from './vars';
import {
  clearWPToken,
  setWPToken,
  updateUserFromServer,
  validateWPToken,
} from './wpauth';
import { loadingUser } from './user';

//* I18n
const i18n = createI18n<[Translation], SupportedLanguages>({
  locale: 'en',
  fallbackLocale: 'es',
  messages,
  legacy: false,
  globalInjection: true,
});
Preferences.keys().then(({ keys }: { keys: string[] }) => {
  if (!keys.includes(KEY_LOCALE))
    Device.getLanguageCode().then(({ value }: { value: string }) => {
      // @ts-expect-error After a couple tries this is what works, even though the types are messed up
      i18n.global.locale.value =
        (locale.getByTag(value.toLowerCase()) ?? { 'iso639-1': 'en' })[
          'iso639-1'
        ] ?? 'en';
    });
  else {
    console.info('LOAD > locale is saved so loading from preferences');
    Preferences.get({ key: KEY_LOCALE }).then(
      ({ value }: { value: string | null }) => {
        // @ts-expect-error After a couple tries this is what works, even though the types are messed up
        i18n.global.locale.value = value ?? 'en'; // The saved value will always be a valid locale code
      }
    );
  }

  // TODO Make some loading ref so app can show loading while not finished the login checks
  // TODO Move this to App.vue and show alert that Sesión caducó and suggest log in
  //* ===== Login
  if (keys.includes(KEY_WP_TOKEN)) {
    Preferences.get({ key: KEY_WP_TOKEN }).then(async ({ value: token }) => {
      setWPToken(token || '');
      const validated = await validateWPToken();
      if (validated.valid) {
        updateUserFromServer().then(() => (loadingUser.value = false));
      } else {
        loadingUser.value = false;
        alertController
          .create({
            header: 'Sesión caducada',
            message:
              'Inicia sesión de nuevo para poder seguir usando la app como antes',
            buttons: [
              {
                text: 'No iniciar',
                role: 'cancel',
                handler: clearWPToken,
              },
              {
                text: 'Iniciar sesión',
                handler: () => router.push('/auth/login'),
              },
            ],
          })
          .then((a) => a.present());
      }
    });
  } else {
    loadingUser.value = false;
  }
  //* =====
});
//* =====

//* ===== Vue
const app = createApp(App).use(IonicVue).use(i18n).use(VWave, {}).use(router);

router.isReady().then(() => {
  app.mount('#app');
});
//* =====
