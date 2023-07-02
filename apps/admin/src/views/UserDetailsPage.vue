<template>
  <PageWrapper back :title="(userName as string)">
    <!--ion-text color="danger" v-if="error">Error</!--ion-text-->
    <ion-card v-if="!isLoading">
      <ion-card-header>
        <IonCardTitle> Datos personales </IonCardTitle>
      </ion-card-header>
      <IonCardContent>
        <IonItem>
          <!-- TODO maybe make them all copy on click but this (DB uID) instead show a toast saying that this ID should be kept private -->
          <IonInput
            label="ID"
            label-placement="fixed"
            readonly
            :value="user?.wp.id"
            disabled
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            label="Nombre de usuario (username)"
            label-placement="floating"
            readonly
            :value="user?.wp.username"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            label="Apodo (nickname)"
            label-placement="floating"
            readonly
            :value="user?.wp.nickname"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            label="Nombre (first_name)"
            label-placement="stacked"
            readonly
            :value="user?.wp.first_name"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            label="Apellido (last_name)"
            label-placement="stacked"
            readonly
            :value="user?.wp.last_name"
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            label="Correo electrónico (email)"
            label-placement="stacked"
            type="email"
            readonly
            :value="user?.wp.email"
          ></IonInput>
        </IonItem>
      </IonCardContent>
    </ion-card>
    <ion-card v-if="!isLoading">
      <ion-card-header>
        <IonCardTitle> Información interna </IonCardTitle>
      </ion-card-header>
      <IonCardContent>
        <IonItem>
          <IonInput
            label="ID para asistencia"
            label-placement="stacked"
            type="text"
            readonly
            :value="user?.supabase.id"
          ></IonInput>
        </IonItem>
      </IonCardContent>
    </ion-card>
    <ion-card v-if="!isLoading">
      <ion-card-header>
        <IonCardTitle> Permisos de administrador </IonCardTitle>
        <IonBadge
          style="position: absolute; top: 1.5rem; right: 2em"
          :color="isAdmin ? 'success' : 'danger'"
          >{{ isAdmin ? 'Admin' : 'User' }}</IonBadge
        >
      </ion-card-header>
      <IonCardContent v-if="isAdmin">
        <!-- TODO Add help button to show up an alert explaining each permission -->
        <!-- TODO Add an onclick.prevent.stop for allow_schedule and show toast explaining that it is yet to implement -->
        <IonItem>
          <IonLabel> Editar franjas de asistencia </IonLabel>
          <IonToggle
            slot="end"
            type="email"
            @ion-change="
              updatePermissions('allow_schedule', $event.target.checked)
            "
            :disabled="user?.supabase.allow_admins || true"
            :checked="user?.supabase.allow_schedule || false"
          ></IonToggle>
        </IonItem>
        <IonItem>
          <IonLabel> Ver y actualizar asistencia </IonLabel>
          <IonToggle
            slot="end"
            type="email"
            @ion-change="
              updatePermissions('allow_attendance', $event.target.checked)
            "
            :disabled="user?.supabase.allow_admins || true"
            :checked="user?.supabase.allow_attendance || false"
          ></IonToggle>
        </IonItem>
        <IonItem>
          <IonLabel> Crear y editar notificaciones </IonLabel>
          <IonToggle
            slot="end"
            type="email"
            @ion-change="
              updatePermissions('allow_notifications', $event.target.checked)
            "
            :disabled="user?.supabase.allow_admins || true"
            :checked="user?.supabase.allow_notifications || false"
          ></IonToggle>
        </IonItem>
        <IonItem>
          <IonLabel> Ver los datos de todos los usuarios </IonLabel>
          <IonToggle
            slot="end"
            type="email"
            @ion-change="
              updatePermissions('allow_users', $event.target.checked)
            "
            :disabled="user?.supabase.allow_admins || true"
            :checked="user?.supabase.allow_users || false"
          ></IonToggle>
        </IonItem>
        <IonItem>
          <IonLabel> Gestionar administradores </IonLabel>
          <IonToggle
            slot="end"
            type="email"
            @ion-change="
              updatePermissions('allow_admins', $event.target.checked)
            "
            :disabled="user?.supabase.allow_admins || true"
            :checked="user?.supabase.allow_admins || false"
          ></IonToggle>
        </IonItem>
      </IonCardContent>
      <IonCardContent v-else>
        <IonItem
          @click="updatePermissions('is_admin', true)"
          button
          lines="none"
          class="text-cblue"
        >
          Convertir usuario en administrador
          <IonIcon
            class="text-inherit"
            :icon="arrowUpCircleOutline"
            slot="end"
          ></IonIcon>
        </IonItem>
      </IonCardContent>
    </ion-card>

    <ion-fab
      @click="openJSON"
      v-if="!isLoading"
      slot="fixed"
      vertical="bottom"
      horizontal="end"
    >
      <ion-fab-button color="medium">
        <ion-icon :icon="code"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </PageWrapper>
</template>

<script setup lang="ts">
// TODO Store logged in user somewhere and ensure that it allows to modify others admins rights only if the logged in user can

import PageWrapper from '../components/PageWrapper.vue';
import JSONViewerVue from '../components/JSONViewer.vue';
import {
  toastController,
  loadingController,
  modalController,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonLabel,
  IonBadge,
  IonToggle,
  IonIcon,
} from '@ionic/vue';
import {
  alertCircleOutline,
  arrowUpCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  code,
} from 'ionicons/icons';

import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { useCacheable } from '../cache';
import type { DefinedCacheable } from '../cache';
import { Database } from 'libs/supabase/src/types';
import { wpapi } from '../req';
import { authHeaders } from '../wpauth';

const route = useRoute();
const supabase = useSupabase();
const logger = useLogger();

const apiResponse = ref();

const userId = ref(route.params.id);
const userName = ref(route.params.name);

loadingController
  .create({
    message: 'Loading user...',
    duration: 30000,
  })
  .then((loader) => loader.present());

const { value: user, isLoading } = (
  useCacheable as DefinedCacheable<
    | {
        wp: WPUser;
        supabase: Database['public']['Tables']['users']['Row'];
      }
    | undefined
  >
)(
  `user-${userId.value}`,
  async () => {
    console.info('getting user from wp');
    const res = await wpapi.get(`wp/v2/users/${userId.value}?context=edit`, {
      headers: authHeaders({}),
    });
    apiResponse.value = res;
    const wpUser = await res.json<WPUser>();

    const { data: supabaseUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', wpUser.acf.id_base_de_datos_app)
      .single();

    // console.log('> Got from supabase', user, error);

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
      return undefined;
    } else {
      console.log(supabaseUser);
      return {
        wp: wpUser,
        supabase: supabaseUser,
      };
    }
  },
  {
    email: '',
    id: userId.value as string,
    is_admin: false,
    allow_notifications: false,
    allow_users: false,
    allow_schedule: false,
    allow_assistance: false, // TODO This is attendance not assistance
    allow_register: false,
    allow_admins: false,
  } as Database['public']['Tables']['users']['Row']
);

const isAdmin = computed(() =>
  user.value === undefined || user.value.supabase === undefined
    ? false
    : user.value.supabase.is_admin
);

watch(userId, () => {
  return;
});

watch(isLoading, (val) => {
  if (!val) loadingController.dismiss();
});

const updatePermissions = (
  key:
    | 'is_admin'
    | 'allow_admins'
    | 'allow_attendance'
    | 'allow_notifications'
    | 'allow_schedule'
    | 'allow_users',
  status: boolean
) => {
  supabase
    .from('users')
    .update({
      [key]: status,
    })
    .eq('id', user.value?.supabase.id)
    .then(({ data, error }) => {
      if (error) {
        useToast({
          message: 'Error actualizando usuario, error reportado',
          color: 'danger',
          icon: closeCircleOutline,
        });
        logger.error(
          'userDetails:updatePermissions',
          'error from supabase on update',
          { data, error }
        );
        // FirebaseCrashlytics.recordException({
        //   stacktrace: StackTrace,
        // });
      } else
        useToast({
          message: 'Usuario actualizado',
          color: 'success',
          icon: checkmarkCircleOutline,
        });
    });
};

const openJSON = () => {
  modalController
    .create({
      component: JSONViewerVue,
      componentProps: {
        data: user.value,
      },
    })
    .then((modal) => modal.present());
};
</script>
