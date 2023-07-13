<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import * as StackTrace from 'stacktrace-js';

const logger = useLogger();

onMounted(async () => {
  window.onerror = async (event, source, lineno, colno, error) => {
    FirebaseCrashlytics.addLogMessage({
      message: 'fired window.onerror',
    });

    const stacktrace = await StackTrace.fromError(
      error || new Error('undefined error')
    );

    logger.error('window:onerror', 'global window error', {
      window,
      event,
      source,
      lineno,
      colno,
      error,
      stacktrace,
    });
    await FirebaseCrashlytics.recordException({
      message: `Unhandled error ocurred: ${event}`,
      stacktrace,
    });

    return true;
  };

  const mode = (
    await Preferences.get({
      key: 'ceebiAdmin.mode',
    })
  ).value;
  console.log('setting mode', mode);
  if (mode) document.body.parentElement?.setAttribute('mode', mode);
}); // TODO Apply .ios | .md to all ion- components
</script>
