<template>
  <PageWrapper :title="(userName as string)" back>
    <FullpageNoPermission
      v-if="!canAccessAttendance"
      permission="visualizar o editar la asistencia"
    ></FullpageNoPermission>
    <template v-else>
      <IonLoading
        :is-open="isLoading"
        message="Cargando asistencia..."
      ></IonLoading>
      <template v-if="isReady">
        <!--* Vista rápida de si tiene el certificado o no -->
        <!-- TODO Tener en cuenta si ha acabado o no el CEEBI, y mostrar en medium o warning si no llega al 80 pero aún no ha acabado el congreso -->
        <IonCard>
          <IonCardContent class="p-0">
            <IonItem
              :color="hasCertificate ? 'success' : 'danger'"
              class="w-full h-full"
            >
              <IonIcon
                slot="start"
                :icon="
                  hasCertificate ? checkmarkCircleOutline : closeCircleOutline
                "
              ></IonIcon>
              {{
                hasCertificate ? 'Certificado obtenido' : 'No alcanza el 80%'
              }}
            </IonItem>
          </IonCardContent>
        </IonCard>
        <!--* Circle progress de la asistencia -->
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Progreso asistencia</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div class="grid place-items-center">
              <circle-progress
                class="h-[80%] block w-full"
                :percent="totalPercent"
                :is-gradient="true"
                :gradient="{
                  angle: 110,
                  startColor: style.getPropertyValue('--ion-color-primary'),
                  stopColor: style.getPropertyValue('--ion-color-secondary'),
                }"
                circle-color="transparent"
                :border-width="12"
              >
              </circle-progress>
            </div>
            <div
              :class="hasCertificate ? 'bg-cgreen' : 'bg-cred'"
              class="circle-mark bg-opacity-95 h-3 w-10 rounded-full absolute"
            ></div>
            <span style="font-size: 24px" class="absolute top-[35%] left-[44%]">
              {{ totalPercent }}%
            </span>
          </IonCardContent>
        </IonCard>
        <!--* Listado de toda la asistencia registrada -->
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Eventos asistidos</IonCardTitle>
            <IonButton
              fill="clear"
              class="absolute right-1 top-2"
              @click="addAttendancePrompt"
            >
              <IonIcon slot="icon-only" :icon="addOutline"></IonIcon>
            </IonButton>
          </IonCardHeader>
          <IonCardContent>
            <IonText v-if="attendance?.length === 0" color="medium">
              Aún no ha asistido a ninguna sesión
            </IonText>
            <ion-list v-else>
              <template v-for="item in attendance" :key="item.time">
                <ion-item-sliding>
                  <IonItemOptions side="start">
                    <IonItemOption
                      color="medium"
                      @click="openItemDetailsJSON(item)"
                      >Detalles</IonItemOption
                    >
                  </IonItemOptions>
                  <template v-if="item.event === null">
                    <ion-item
                      class="attendance-list-item"
                      v-for="(event, index) in  (item.schema?.events as string[])"
                      :key="event"
                    >
                      <span
                        style="
                          color: var(--ion-color-primary);
                          margin-right: 0.4rem;
                          font-weight: 700;
                        "
                        >{{
                          (item.schema?.eventHours || ['-', '-', '-'])[index]
                        }}h</span
                      >{{ event }}
                    </ion-item>
                  </template>
                  <ion-item v-else class="attendance-list-item">
                    <span
                      style="
                        color: var(--ion-color-primary);
                        margin-right: 0.4rem;
                        font-weight: 700;
                      "
                      >{{ item.schema?.hours }}h</span
                    >{{ item.event }}
                  </ion-item>
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" @click="deleteItem(item)"
                      >Eliminar</IonItemOption
                    >
                  </IonItemOptions>
                </ion-item-sliding>
              </template>
            </ion-list>
          </IonCardContent>
        </IonCard>
      </template>
    </template>
  </PageWrapper>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLoading,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonButton,
  modalController,
  actionSheetController,
} from '@ionic/vue';
import PageWrapper from '../components/PageWrapper.vue';
import { computedEager, useAsyncState } from '@vueuse/core';
import attendanceSchema from '../../attendance.json';
import {
  closeCircleOutline,
  checkmarkCircleOutline,
  addOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { JSONViewer } from '@code/ceebi-ui';
//@ts-expect-error vue3-circle-progress has no support for TypeScript
import CircleProgress from 'vue3-circle-progress';
import { getUser } from '../user';
import FullpageNoPermission from '../components/FullpageNoPermission.vue';
import { logPostgrestError } from '@code/capacitor-utils';

const style = getComputedStyle(document.body);

const route = useRoute();
const supabase = useSupabase();
const logger = useLogger();

const userId = ref(route.params.id); // This is the supabase id
const userName = ref(route.params.name);

const me = getUser();

const canAccessAttendance = computed(() => me.value?.supabase.allow_attendance);

const openItemDetailsJSON = (data: any) => {
  modalController
    .create({
      component: JSONViewer,
      componentProps: {
        data,
      },
    })
    .then((m) => m.present());
};

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
const deleteItem = async (
  item: ArrayElement<Awaited<ReturnType<typeof loadAttendance>>>
) => {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', item.id);
  if (error) {
    useToast({
      message: 'Error al eliminar asistencia, consulta el registro',
      color: 'danger',
      icon: closeCircleOutline,
    });
    logger.error(
      'attendanceDetails:addAttendance',
      'error from supabase when deleting attendance',
      error,
      { userId, userName }
    );
  } else {
    useToast({
      message: 'Asistencia actualizada, recargando',
      color: 'success',
      icon: checkmarkCircleOutline,
    });
    attendance.value = await loadAttendance();
  }
};

const addAttendance = async (session: string, event: string | null = null) => {
  const { error } = await supabase.from('attendance').insert({
    created_by: me.value?.supabase.id || '',
    attendant_id: userId.value as string,
    session,
    event,
  });
  if (error) {
    useToast({
      message: 'Error al añadir asistencia, consulta el registro',
      color: 'danger',
      icon: closeCircleOutline,
    });
    logger.error(
      'attendanceDetails:addAttendance',
      'error from supabase when adding attendance',
      error,
      { userId, userName }
    );
  } else {
    useToast({
      message: 'Asistencia actualizada, recargando',
      color: 'success',
      icon: checkmarkCircleOutline,
    });
    attendance.value = await loadAttendance();
  }
};

const addAttendancePrompt = async () => {
  const sheet = await actionSheetController.create({
    header: 'Seleccionar sesión',
    buttons: [
      ...attendanceSchema.map((session) => ({
        text: session.name,
        handler: async () => {
          if (session.hasEvents) {
            const act = await actionSheetController.create({
              header: 'Seleccionar evento',
              buttons: [
                ...session.events.map((event) => ({
                  text: event,
                  handler: () => addAttendance(session.name, event),
                })),
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'cancel-button',
                },
              ],
            });
            act.present();
          } else {
            addAttendance(session.name);
          }
        },
      })),
      // {
      //   text: 'Miércoles 17.30 - 20.00',
      //   handler: () =>
      //     sessionSelected({
      //       name: 'Miércoles 17.30 - 20.00',
      //       selectableEvent: false,
      //     }),
      // },
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'cancel-button',
      },
    ],
  });
  sheet.present();
};

const loadAttendance = async () => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('attendant_id', userId.value)
    .order('date');

  if (error) {
    logPostgrestError(
      'attendanceDetails:loadAttendance',
      'error when loading user attendance details from supabase',
      data,
      error
    );
    useToast({
      color: 'danger',
      icon: alertCircleOutline,
      message: 'Error al obtener la asistencia del usuario',
    });
    return [];
  } else {
    return data.map((raw) => ({
      ...raw,
      schema: attendanceSchema.find(({ name }) => raw.session === name),
    }));
  }
};

const {
  state: attendance,
  isLoading,
  isReady,
} = useAsyncState(loadAttendance, []);

const totalHours = computed(
  () =>
    attendance.value?.reduce(
      (acc, curr) => acc + (curr.schema?.hours ?? 0),
      0
    ) ?? 0
);

const totalPercent = computed(() =>
  Math.round((Math.min(25, totalHours.value) / 25) * 100)
);

const hasCertificate = computedEager(() => (totalHours.value ?? 0) > 25 * 0.8);

// TODO Implement checking who passed that assistance maybe with computedAsync from vueuse
</script>

<style scoped>
.attendance-list-item::part(native) {
  padding-left: 0;
}
</style>

<style>
html.ios .circle-mark {
  @apply top-[29%] left-[22%] rotate-[20deg];
}

html.md .circle-mark {
  @apply top-[29%] left-[25%] rotate-[20deg];
}
</style>
