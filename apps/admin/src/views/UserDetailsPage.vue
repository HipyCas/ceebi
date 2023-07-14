<template>
  <PageWrapper back :title="(userName as string)">
    <FullpageNoPermission
      v-if="!me?.supabase.allow_users"
      permission="visualizar o editar usuarios"
    ></FullpageNoPermission>
    <!--ion-text color="danger" v-if="error">Error</!--ion-text-->
    <template v-else-if="!isLoading">
      <ion-card>
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
      <ion-card>
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
          <IonItem>
            <IonToggle
              :enable-on-off-labels="true"
              @ion-change="updatePoster($event.target.checked)"
              :checked="user?.wp.acf.has_poster"
              >Presenta póster</IonToggle
            >
          </IonItem>
        </IonCardContent>
      </ion-card>
      <ion-card v-if="user?.supabase">
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
                updateProperty('allow_schedule', $event.target.checked)
              "
              :disabled="canINOTModifyAdmins"
              :checked="user?.supabase.allow_schedule || false"
            ></IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel> Ver y actualizar asistencia </IonLabel>
            <IonToggle
              slot="end"
              type="email"
              @ion-change="
                updateProperty('allow_attendance', $event.target.checked)
              "
              :disabled="canINOTModifyAdmins"
              :checked="user?.supabase.allow_attendance || false"
            ></IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel> Crear y editar notificaciones </IonLabel>
            <IonToggle
              slot="end"
              type="email"
              @ion-change="
                updateProperty('allow_notifications', $event.target.checked)
              "
              :disabled="canINOTModifyAdmins"
              :checked="user?.supabase.allow_notifications || false"
            ></IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel> Ver los datos de todos los usuarios </IonLabel>
            <IonToggle
              slot="end"
              type="email"
              @ion-change="updateProperty('allow_users', $event.target.checked)"
              :disabled="canINOTModifyAdmins"
              :checked="user?.supabase.allow_users || false"
            ></IonToggle>
          </IonItem>
          <IonItem>
            <IonLabel> Gestionar administradores </IonLabel>
            <IonToggle
              slot="end"
              type="email"
              @ion-change="
                updateProperty('allow_admins', $event.target.checked)
              "
              :disabled="canINOTModifyAdmins"
              :checked="user?.supabase.allow_admins || false"
            ></IonToggle>
          </IonItem>
        </IonCardContent>
        <IonCardContent v-else>
          <IonItem
            @click="updateProperty('is_admin', true)"
            button
            :detail="false"
            lines="none"
            class="text-cblue"
            :disabled="canINOTModifyAdmins"
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
      <IonCard v-else>
        <IonCardContent class="p-0">
          <IonItem color="danger" class="w-full h-full">
            <IonIcon :icon="closeCircleOutline" slot="start"></IonIcon>
            Usuario no sincronizado
          </IonItem>
        </IonCardContent>
      </IonCard>
      <ion-fab
        @click="openJSON"
        slot="fixed"
        vertical="bottom"
        horizontal="end"
      >
        <ion-fab-button color="medium">
          <ion-icon :icon="code"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </template>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import JSONViewerVue from '../components/JSONViewer.vue';
import {
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
  loadingController,
  modalController,
} from '@ionic/vue';
import {
  alertCircleOutline,
  arrowUpCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  code,
} from 'ionicons/icons';
import { ImpactStyle } from '@capacitor/haptics';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import { useAsyncState } from '@vueuse/core';
import type { Database } from '@code/supabase';
import { logCatchError } from '@code/capacitor-utils';
import { getUser } from '../user';
import { wpapi } from '../req';
import { authHeaders } from '../wpauth';

const route = useRoute();
const supabase = useSupabase();
const logger = useLogger();

const me = getUser();

const apiResponse = ref();

const userId = ref(route.params.id);
const userName = ref(route.params.name);

FirebaseCrashlytics.setContext({
  key: 'page',
  type: 'string',
  value: 'userDetails',
});

loadingController
  .create({
    message: 'Cargando datos...',
    duration: 30000,
  })
  .then((loader) => loader.present());

const { state: user, isLoading } = useAsyncState(async () => {
  try {
    logger.trace('userDetails:useAsyncState', 'getting user from wp');
    const res = await wpapi.get(`wp/v2/users/${userId.value}?context=edit`, {
      headers: authHeaders({}),
    });
    apiResponse.value = res;
    const wpUser = await res.json<WPUser>();

    let supabaseUser = null;
    if (wpUser.acf.id_base_de_datos_app) {
      const { data: _supabaseUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', wpUser.acf.id_base_de_datos_app)
        .single();

      // console.log('> Got from supabase', user, error);
      logger.trace('userDetails:useAsyncState', 'user from supabase', {
        user,
        error,
      });

      if (error) {
        // TODO Make this full page error
        useToast(
          {
            message: 'Error while getting user info',
            color: 'danger',
            icon: alertCircleOutline,
          },
          ImpactStyle.Heavy
        );
        FirebaseCrashlytics.setContext({
          key: 'errorCode',
          type: 'string',
          value: error.code,
        });
        FirebaseCrashlytics.setContext({
          key: 'errorHint',
          type: 'string',
          value: error.hint,
        });
        FirebaseCrashlytics.setContext({
          key: 'errorMessage',
          type: 'string',
          value: error.message,
        });
        FirebaseCrashlytics.setContext({
          key: 'errorDetails',
          type: 'string',
          value: error.details,
        });
        logCatchError(
          logger,
          'userDetails:useAsyncState',
          'error from supabase when getting specific user',
          new Error(error.message)
        );
        return null;
      } else {
        supabaseUser = _supabaseUser;
      }
    }

    return {
      wp: wpUser,
      supabase: supabaseUser,
    };
  } catch (e) {
    logCatchError(
      logger,
      'userDetails:useAsyncState',
      'error when fetching user from WP and Supabase',
      e
    );
  }
}, null);

const isAdmin = computed(() =>
  user.value === null || user.value?.supabase === undefined
    ? false
    : user.value.supabase?.is_admin
);

const canINOTModifyAdmins = computed(() =>
  me.value === null || me.value.supabase === undefined
    ? true
    : me.value?.wp.id === user.value?.wp.id &&
      me.value?.supabase.id === me.value?.supabase.id &&
      me.value.supabase.allow_admins
    ? false
    : (!me.value.supabase.allow_admins || user.value?.supabase?.allow_admins) ??
      true
);

watch(userId, () => {
  return;
});

watch(isLoading, (val) => {
  if (!val) loadingController.dismiss();
});

const updateProperty = (
  key: keyof Database['public']['Tables']['users']['Update'],
  status: boolean
) => {
  supabase
    .from('users')
    .update({
      [key]: status,
    })
    .eq('id', user.value?.supabase?.id)
    .then(({ data, error }) => {
      if (error) {
        useToast(
          {
            message: 'Error actualizando usuario, error reportado',
            color: 'danger',
            icon: closeCircleOutline,
          },
          ImpactStyle.Medium
        );
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

const updatePoster = async (value: boolean) => {
  try {
    const res = await wpapi.post(`wp/v2/users/${user.value?.wp.id}`, {
      json: {
        acf: {
          has_poster: value,
        },
      },
      headers: authHeaders({}),
    });
    if (res.ok) {
      useToast({
        message: 'Usuario actualizado',
        color: 'success',
        icon: checkmarkCircleOutline,
      });
    } else {
      useToast(
        {
          message: 'Error actualizando usuario, error reportado',
          color: 'danger',
          icon: closeCircleOutline,
        },
        ImpactStyle.Medium
      );
      logger.error(
        'userDetails:updatePoster',
        'error from wp api when updating post info',
        { res, json: await res.json() }
      );
      FirebaseCrashlytics.setContext({
        key: 'responseStatusText',
        type: 'string',
        value: res.statusText,
      });
      FirebaseCrashlytics.setContext({
        key: 'responseStatusCode',
        type: 'int',
        value: res.status,
      });
      StackTrace.fromError(new Error('response not ok')).then((stacktrace) =>
        FirebaseCrashlytics.recordException({
          message: 'error from wp api when updating user presents post',
          stacktrace,
        })
      );
    }
  } catch (error) {
    useToast(
      {
        message: 'Error actualizando usuario, error reportado',
        color: 'danger',
        icon: closeCircleOutline,
      },
      ImpactStyle.Medium
    );
    logCatchError(
      logger,
      'userDetails:updatePoster',
      'error when trying to update poster',
      error
    );
  }
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
