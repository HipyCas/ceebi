<template>
  <PageWrapper :title="'Actualizar usuarios'" :back="true">
    <main class="px-5">
      <h1>Actualizar base de datos</h1>
      <p>
        Actualizar la base de datos de Supabase, sincronizándola con las últimas
        inscripciones en WordPress
      </p>
      <div
        v-show="checkingUserRegistered"
        class="flex flex-row items-center justify-center w-full gap-5 py-10"
      >
        <IonSpinner class="h-12 w-12"></IonSpinner>
        <IonLabel class="text-lg">Comprobando cambios...</IonLabel>
      </div>
      <template v-if="usersWithoutID > 0 && !updatingUsers">
        <div
          class="flex flex-row items-center justify-center w-full gap-5 py-10"
        >
          <IonIcon
            color="danger"
            :md="closeOutline"
            :ios="closeOutline"
            class="h-12 w-12"
          ></IonIcon>
          <IonLabel class="text-lg"
            >{{ usersWithoutID }} usuarios no sincronizados</IonLabel
          >
        </div>
        <IonButton expand="block" color="success" @click="syncUsers"
          >Sincronizar</IonButton
        >
      </template>
      <div
        v-else-if="
          usersWithoutID == 0 && !checkingUserRegistered && !updatingUsers
        "
        class="flex flex-row items-center justify-center w-full gap-5 py-10"
      >
        <IonIcon
          color="success"
          :md="checkmarkOutline"
          :ios="checkmarkOutline"
          class="h-12 w-12"
        ></IonIcon>
        <IonLabel class="text-lg">Todos sincronizados</IonLabel>
      </div>
      <div
        v-if="updatingUsers"
        class="flex flex-col items-center justify-center w-full gap-4 py-10"
      >
        <p>
          Actualizando usuario {{ currentUpdatedUser }} de {{ usersWithoutID }}
        </p>
        <IonProgressBar
          :value="(currentUpdatedUser - 1) / usersWithoutID"
        ></IonProgressBar>
      </div>
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import {
  IonSpinner,
  IonLabel,
  IonIcon,
  IonButton,
  IonProgressBar,
  modalController,
} from '@ionic/vue';
import { wpapi } from '../../req';
import PageWrapper from '../../components/PageWrapper.vue';
import { useSupabase } from '@code/supabase';
import { authHeaders, getWPToken } from '../../wpauth';
import {
  closeCircleOutline,
  closeOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { useToast } from '@code2/ceebi-ui';
import type { WPUser } from '@code/wp-types';

const supabase = useSupabase();

const checkingUserRegistered = ref(true);
const updatingUsers = ref(false);

console.log(getWPToken());

const users: WPUser[] = [];
let usersWithoutID = 0;
const currentUpdatedUser = ref(1);

(async () => {
  const res = await wpapi.get(
    'wp/v2/users?context=edit&per_page=100&_fields=acf.id_base_de_datos_app,roles,email,id',
    {
      headers: authHeaders({}),
    }
  );
  const total_pages = Number.parseInt(
    res.headers.get('X-WP-TotalPages') || '0'
  );
  console.info('[UPDATE USERS] Total pages:', total_pages);
  users.push(...(await res.json<WPUser[]>()));

  for (let page = 1; page <= total_pages; page++) {
    const res = await wpapi.get(
      `wp/v2/users?context=edit&per_page=100&page=${page}&_fields=acf.id_base_de_datos_app,roles,email,id`,
      {
        headers: authHeaders({}),
      }
    );
    console.log('[UPDATE USERS] Fetched page ' + page, res);
    users.push(...(await res.json<WPUser[]>()));
  }

  console.info('[UPDATE USERS] users', users);

  users.forEach((user) => {
    if (user.acf.id_base_de_datos_app === '') usersWithoutID++;
  });

  checkingUserRegistered.value = false;
})();

const syncUsers = async () => {
  updatingUsers.value = true;
  for (const user of users.filter((u) => u.acf.id_base_de_datos_app === '')) {
    // await new Promise((r) => setTimeout(r, 100));
    console.info('updating user', user);
    const { data, error } = await supabase
      .from('users')
      .insert({
        is_admin: user.roles.includes('administrator'),
        email: user.roles.includes('administrator') ? user.email : undefined,
      })
      .select('id')
      .single();
    if (error) {
      useToast({
        message: 'Error when creating user in DB',
        color: 'danger',
        icon: closeCircleOutline,
        duration: 4000,
        buttons: [
          {
            text: 'Inspect',
            handler: () =>
              modalController
                .create({
                  component: defineAsyncComponent(
                    () => import('../../components/JSONViewer.vue')
                  ),
                  componentProps: {
                    data: {
                      error: error,
                      data: data,
                    },
                  },
                })
                .then((m) => m.present()),
          },
        ],
      });
      break;
    }
    console.info('created user in supabase', data, error);
    const res = await wpapi.post(`wp/v2/users/${user.id}`, {
      json: {
        acf: {
          id_base_de_datos_app: data?.id,
        },
      },
      headers: authHeaders({}),
    });
    console.info('response', res);
    currentUpdatedUser.value++;
  }
  usersWithoutID = 0;
  updatingUsers.value = false;
  currentUpdatedUser.value = 0;
};
</script>
