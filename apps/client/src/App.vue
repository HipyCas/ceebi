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
} from '@ionic/vue';

import * as locales from 'locale-codes';
import * as StackTrace from 'stacktrace-js';

import { LocalNotifications } from '@capacitor/local-notifications';
import {
  PushNotifications,
  type PushNotificationSchema,
  type ActionPerformed,
} from '@capacitor/push-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import {
  AppUpdate,
  AppUpdateAvailability,
  FlexibleUpdateInstallStatus,
} from '@capawesome/capacitor-app-update';
import { Translation, Language } from '@capacitor-mlkit/translation';

import { KEY_PUSH_ENABLED, KEY_DARK_MODE, KEY_WP_TOKEN } from './vars';
import { toggleDarkMode } from './ui';
import { setDarkMode } from './darkMode';
import {
  clearWPToken,
  setWPToken,
  updateUserFromServer,
  validateWPToken,
} from './wpauth';
import { loadingUser } from './user';
import { logCatchError } from '@code/capacitor-utils';

const { locale, t } = useI18n();
const router = useIonRouter();
const logger = useLogger();

console.log(
  'hello',
  typeof import.meta.env.VITE_ENCRYPTION_KEY,
  import.meta.env.VITE_ENCRYPTION_KEY,
  JSON.parse(import.meta.env.VITE_ENCRYPTION_KEY)
);

//* PUSH NOTIFICATIONS
const registerPush = () => {
  PushNotifications.addListener('registration', async (token) => {
    logger.trace(
      'pushNotifications:listener(registration)',
      'registration successful',
      { token }
    );
  }).catch((e) =>
    logger.error(
      'pushNotifications:listener(registration)',
      'error registering device for push notifications',
      { error: e }
    )
  );

  PushNotifications.addListener(
    'pushNotificationReceived',
    async (notification: PushNotificationSchema) => {
      logger.info(
        'pushNotifications:listener(pushNotificationReceived)',
        'received push notification',
        { notification }
      );
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
          logger.trace(
            'pushNotifications:listener(pushNotificationReceived)',
            'shown notification with local notifications',
            { res }
          )
        )
        .catch((e) =>
          logCatchError(
            logger,
            'pushNotifications:listener(pushNotificationReceived)',
            'error displaying push notification',
            e
          )
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
};
(async () => {
  if (isPlatform('capacitor')) {
    const permissionGranted = await PushNotifications.checkPermissions().then(
      (value) => value.receive === 'granted'
    );
    if (permissionGranted) {
      registerPush();
    } else {
      PushNotifications.requestPermissions().then((permission) => {
        if (permission.receive === 'granted') {
          registerPush();
        }
      });
    }
  }
})();

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
      header: t('appUpdate.alertHeader'),
      message: t('appUpdate.alertMessage', {
        currentVersion,
        availableVersion,
      }),

      buttons: [
        {
          text: t('appUpdate.alertLater'),
          role: 'cancel',
        },
        {
          text: t('appUpdate.alertUpdate'),
          handler: () => {
            if (flexibleUpdateAllowed) {
              AppUpdate.startFlexibleUpdate();
              AppUpdate.addListener(
                'onFlexibleUpdateStateChange',
                ({ installStatus }) => {
                  if (installStatus === FlexibleUpdateInstallStatus.INSTALLED)
                    useToast({
                      message: t('appUpdate.toastUpdated'),
                      buttons: [
                        {
                          text: t('appUpdate.alertUpdate'),
                          handler: () => AppUpdate.completeFlexibleUpdate(),
                        },
                      ],
                    });
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

  const { keys } = await Preferences.keys();

  // Load dark/light mode
  (async () => {
    if (keys.includes(KEY_DARK_MODE)) {
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
  })();

  //* ===== Login
  (async () => {
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
              header: t('auth.sessionExpiredAlert.header'),
              message: t('auth.sessionExpiredAlert.message'),
              buttons: [
                {
                  text: t('auth.sessionExpiredAlert.dontLogin'),
                  role: 'cancel',
                  handler: clearWPToken,
                },
                {
                  text: t('auth.login'),
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
  })();
  //* =====

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
