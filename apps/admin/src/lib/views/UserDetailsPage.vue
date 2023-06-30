<template>
  <PageWrapper back title="Danae Molina">
    <ion-text color="danger" v-if="error">Error</ion-text>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '~/components/PageWrapper.vue';
import { toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';
import { toastController, IonText } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';

import { useSupabase } from '@code/supabase';

const route = useRoute();

const { id: userId } = toRefs(route.params);

watch(userId, () => {
  return;
});

const { data: user, error } = await useSupabase().from('profiles').select('*');

if (error) {
  // TODO Make this full page error
  toastController
    .create({
      message: 'Error while getting user info',
      color: 'danger',
      icon: alertCircleOutline,
      duration: 2000, // TODO Add offset like in the client app, maybe move it to another lib so both use the same
    })
    .then((t) => t.present());
}
</script>
