import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import '.../../libs/ceebi-ui/src/common.css';
import 'unfonts.css';

import * as StackTrace from 'stacktrace-js';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';

const app = createApp(App).use(IonicVue).use(router);

const logger = useLogger();
app.config.errorHandler = async (error, instance, info) => {
  FirebaseCrashlytics.addLogMessage({
    message: 'fired Vue app errorHandler',
  });
  const stacktrace = await StackTrace.fromError(
    new Error(`ERROR ${error}: ${info}`),
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
  app.mount('#app');
});

// TODO Create a unique app id and store that in a personal database from where I can toggle which parts of the app can be used and which not, effectively implementing a licensing mechanism
