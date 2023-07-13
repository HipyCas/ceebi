<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  isPlatform,
  alertController,
  toastController,
} from '@ionic/vue';
import { onMounted } from 'vue';

import { LocalNotifications } from '@capacitor/local-notifications';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import {
  AppUpdate,
  AppUpdateAvailability,
  FlexibleUpdateInstallStatus,
} from '@capawesome/capacitor-app-update';
import { KEY_PUSH_ENABLED, KEY_DARK_MODE } from './vars';
// import { logEvent } from 'firebase/analytics';
import * as StackTrace from 'stacktrace-js';
// import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { toggleDarkMode } from './ui';
import { setDarkMode } from './darkMode';
import { useI18n } from 'vue-i18n';
import { Translation, Language } from '@capacitor-mlkit/translation';
import * as locales from 'locale-codes';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';

const { locale } = useI18n();
console.log(locale.value);

console.log(
  'hello',
  typeof import.meta.env.VITE_ENCRYPTION_KEY,
  import.meta.env.VITE_ENCRYPTION_KEY,
  JSON.parse(import.meta.env.VITE_ENCRYPTION_KEY)
);

//* PUSH NOTIFICATIONS
if (false && isPlatform('capacitor')) {
  PushNotifications.addListener('registration', async (token: Token) => {
    console.log('===== FIREBASE TOKEN: ' + token.value + ' =====');
  }).catch((e) => console.warn('>>>> FIREBASE REGISTRATION ERROR: ' + e));

  // TODO Move this to slides so you explain why you ask for this permission
  PushNotifications.requestPermissions().then((res) => {
    console.log('App:26 push permissions: ', res.receive);
    if (res.receive === 'granted') PushNotifications.register();
  });

  PushNotifications.addListener(
    'pushNotificationReceived',
    async (notification: PushNotificationSchema) => {
      console.log('PUSH >>>> Push received: ' + JSON.stringify(notification));
      // Show notification in case you don't have the app open
      LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || '',
            body: notification.body || '',
            id: Date.now(),
            extra: notification.data,
            // smallIcon: "@mipmap/push_icon",
          },
        ],
      })
        .then((res) =>
          console.info('PUSH >>>> Scheduled: ', JSON.stringify(res))
        )
        .catch((e) =>
          console.warn('PUSH >>> ERROR while setting local notification: ' + e)
        );
      // Save notification
      const { value: notificationsJSON } = await Preferences.get({
        key: KEY_PUSH_ENABLED,
      });
      const notifications: PushNotificationSchema[] = JSON.parse(
        notificationsJSON || ''
      );
      console.info('PUSH >>>> Saving notification');
      notifications.push(notification);
      Preferences.set({
        key: KEY_PUSH_ENABLED,
        value: JSON.stringify(notifications),
      })
        .catch((e) => console.error('PUSH >>>> Error while saving push: ' + e))
        .then(() => console.info('PUSH >>>> Successfully saved notification'));
    }
  );

  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    async (notification: ActionPerformed) => {
      const data = notification.notification.data;
      console.log(
        'PUSH >>>> Action performed: ' +
          JSON.stringify(notification.notification)
      );
      if (data) {
        console.info('PUSH >>> data ' + JSON.stringify(data));
      }
    }
  );
}

//* CHECK FOR UPDATE
if (isPlatform('capacitor')) {
  (async () => {
    const {
      updateAvailability,
      flexibleUpdateAllowed,
      immediateUpdateAllowed,
      availableVersion,
      currentVersion,
    } = await AppUpdate.getAppUpdateInfo();
    if (updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
      return;
    }
    const alert = await alertController.create({
      header: 'App update available',
      message:
        'We recommend you to update the application.\nCurrent version: ' +
        currentVersion +
        '. New version: ' +
        availableVersion,
      buttons: [
        {
          text: 'Later',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: () => {
            if (flexibleUpdateAllowed) {
              AppUpdate.startFlexibleUpdate();
              AppUpdate.addListener(
                'onFlexibleUpdateStateChange',
                ({ installStatus }) => {
                  if (installStatus === FlexibleUpdateInstallStatus.INSTALLED)
                    toastController
                      .create({
                        message: 'App updated, restart to apply updates',
                        buttons: [
                          {
                            text: 'Update',
                            handler: () => AppUpdate.completeFlexibleUpdate(),
                          },
                        ],
                      })
                      .then((toast) => toast.present());
                }
              );
            } else if (immediateUpdateAllowed) {
              AppUpdate.performImmediateUpdate();
            } else {
              AppUpdate.openAppStore();
            }
          },
        },
      ],
    });
    alert.present();
  })();
}

//* HIDE SPLASHSCREEN ON MOUNTED
onMounted(async () => {
  // Set timeout to hide splash screen
  setTimeout(SplashScreen.hide, 250);

  // Load dark/light mode
  if ((await Preferences.keys()).keys.includes(KEY_DARK_MODE)) {
    const darkModeResult: boolean = JSON.parse(
      (
        await Preferences.get({
          key: KEY_DARK_MODE,
        })
      ).value || 'false'
    );
    toggleDarkMode(darkModeResult);
    setDarkMode(darkModeResult);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleDarkMode(prefersDark.matches);
    setDarkMode(prefersDark.matches);
  }

  (async () => {
    console.info('[TRANSLATION] Starting model downloads...');
    console.log('[TRANSLATION] Downloading Spanish model...');
    await Translation.downloadModel({
      language: Language.Spanish,
    });
    console.log(`[TRANSLATION] Downloaded Spanish model!`);

    console.log(
      `[TRANSLATION] Checking if model exists for locale ${locale} (${
        locales.getByTag(locale as unknown as string).name
      })...`
    );
    console.log(
      `[TRANSLATION] Available models are (${Array.isArray(
        Object.keys(Language)
      )}): ${Object.keys(Language).join(', ')}`
    );
    if (
      locale !== undefined &&
      Object.keys(Language).includes(
        locales.getByTag(locale as unknown as string).name
      )
    ) {
      console.log(
        `[TRANSLATION] Downloading actual locale (${locale}) model: ${
          Language[locales.getByTag(locale as unknown as string).name]
        }...`
      );
      await Translation.downloadModel({
        //@ts-expect-error Checked model exists before
        language: Language[locales.getByTag(locale as unknown as string).name],
      });
      console.log(`[TRANSLATION] Downloaded actual locale (${locale}) model!`);
    } else
      console.error(
        '[TRANSLATION] Language',
        locale,
        'not available for translation'
      );
  })();

  // Override global error handling to send report to Firebase Crashlytics
  window.onerror = (ev, source, lineno, colno, error) => {
    FirebaseCrashlytics.addLogMessage({
      message: 'fired window.onerror',
    });
    (async () => {
      const stacktrace = await StackTrace.fromError(
        error ||
          new Error(`ERROR from ev ${ev} (${source} - L${lineno}:C${colno})`)
      );
      await FirebaseCrashlytics.recordException({
        message: `Unhandled error ocurred: ${error} [event: ${ev}; source: ${source}] - L${lineno}:C${colno}`,
        stacktrace,
      });
    })();
  };
});
</script>
