import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VWave from 'v-wave';

import { IonicVue } from '@ionic/vue';

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
import { KEY_LOCALE } from './vars';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import loadSettings from './loadSettings';

import messages from '@intlify/unplugin-vue-i18n/messages';

const logger = useLogger();

logger.trace('main', App);

//* I18n
const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'es',
  messages,
  legacy: false,
  globalInjection: true,
});
Preferences.keys().then(({ keys }: { keys: string[] }) => {
  if (!keys.includes(KEY_LOCALE))
    Device.getLanguageCode().then(({ value }: { value: string }) => {
      // ts-expect-error After a couple tries this is what works, even though the types are messed up
      i18n.global.locale.value =
        (locale.getByTag(value.toLowerCase()) ?? { 'iso639-1': 'en' })[
          'iso639-1'
        ] ?? 'en';
    });
  else {
    console.info('LOAD > locale is saved so loading from preferences');
    Preferences.get({ key: KEY_LOCALE }).then(
      ({ value }: { value: string | null }) => {
        // ts-expect-error After a couple tries this is what works, even though the types are messed up
        i18n.global.locale.value = value ?? 'en'; // The saved value will always be a valid locale code
      }
    );
  }
});
//* =====

logger.trace('main', 'loading settings');
loadSettings();
logger.trace('main', 'settings loaded');

//* ===== Vue
const app = createApp(App).use(IonicVue).use(i18n).use(VWave, {}).use(router);

app.config.errorHandler = async (error, instance, info) => {
  FirebaseCrashlytics.addLogMessage({
    message: 'fired Vue app errorHandler',
  });
  const stacktrace = await StackTrace.fromError(
    new Error(`ERROR ${error}: ${info}`)
  );
  logger.error('vueApp:errorHandler', 'error in vue app', {
    info,
    error,
    instance,
    stacktrace,
  });
  await FirebaseCrashlytics.recordException({
    message: `Unhandled error ocurred: ${info}`,
    stacktrace,
  });
};
app.config.warnHandler = (msg, instance, trace) => {
  FirebaseCrashlytics.addLogMessage({
    message: 'fired Vue app warnHandler',
  });
  logger.warn('vueApp:warnHandler', 'warning in vue app', {
    msg,
    instance,
    trace,
  });
};

router.isReady().then(() => {
  logger.trace('main:router.isReady()', 'router ready, mounting app');
  app.mount('#app');
  logger.trace('main:router.isReady()', 'app mounted');
});
//* =====
