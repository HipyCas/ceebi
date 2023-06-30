<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';

const logger = useLogger();

onMounted(async () => {
  window.onerror = (event, source, lineno, colno, error) => {
    logger.error('window:onerror', 'global window error', {
      window,
      event,
      source,
      lineno,
      colno,
      error,
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
