<template>
  <IonPage>
    <Teleport to="html">
      <div
        class="text-white z-40 flex flex-row justify-between px-[5vw] pt-[1rem] gap-2 bg-gradient-to-b from-black via-[#00000055]"
      >
        <div v-once>
          <strong class="font-semibold text-md flex-grow">{{
            event || session
          }}</strong>
          <span v-if="event" class="block text-sm font-light">{{
            session
          }}</span>
        </div>
        <IonButton
          @click="openModal"
          fill="clear"
          class="flex-grow-0 z-10 !text-white"
          v-show="!isModalOpen"
        >
          <IonIcon slot="icon-only" :icon="eyeOutline"></IonIcon>
        </IonButton>
      </div>

      <IonModal class="z-[51]" :is-open="isModalOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Registrados</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <IonNote class="block">Sesión</IonNote>
          {{ session }}
          <IonNote class="block mt-1">Evento</IonNote>
          {{ event }}
          <ion-list class="mt-3 bg-transparent">
            <IonListHeader class="text-lg -ml-2 font-semibold"
              >Códigos registrados</IonListHeader
            >
            <ion-item v-for="(code, index) in codes" :key="code.id">
              <div>
                <p class="p-0 mt-2 mb-0.5 text-sm">{{ code.id }}</p>
                <ion-text color="medium" class="text-xs">
                  {{ code.time.toLocaleString() }}</ion-text
                >
                <div class="h-2"></div>
              </div>
              <ion-button
                class="ion-margin-top"
                slot="end"
                fill="clear"
                :color="code.status === 'pending' ? 'medium' : 'danger'"
                @click="
                  code.status === 'uploaded'
                    ? deleteCode(index)
                    : code.status === 'pending'
                    ? timerInfo()
                    : showCodeError(index)
                "
                :disabled="code.status === 'pending'"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="closeOutline"
                  v-if="code.status === 'uploaded'"
                ></ion-icon>
                <ion-icon
                  slot="icon-only"
                  :icon="warningOutline"
                  v-else-if="code.status === 'error'"
                ></ion-icon>
                <ion-icon
                  slot="icon-only"
                  :icon="timeOutline"
                  v-else
                ></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list> </ion-content
      ></IonModal>

      <Transition name="border">
        <div
          v-show="showBorder"
          class="w-screen h-screen fixed inset-0 border-8 z-50"
          :class="scanSucceded ? 'border-green-500' : 'border-red-500'"
        ></div>
      </Transition>

      <IonButton class="exit-button z-40" color="danger" @click="exitScan"
        >Stop scan</IonButton
      >
    </Teleport>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonNote,
  onIonViewDidLeave,
  IonListHeader,
  modalController,
} from '@ionic/vue';
import {
  eyeOutline,
  timeOutline,
  closeOutline,
  warningOutline,
} from 'ionicons/icons';
import scanTone from '../assets/scan.wav';
import { version as uuidVersion, validate as uuidValidate } from 'uuid';
import { getUser } from '../user';
import type { PostgrestError } from '@supabase/supabase-js';

interface Code {
  id: string;
  time: Date;
  status: 'pending' | 'uploaded' | 'error';
  error?: PostgrestError;
}

const router = useIonRouter();
const route = useRoute();
const supabase = useSupabase();
const user = getUser();

const { session, event } = route.params;

const scanAudio = new Audio(scanTone);

const codes: Ref<Code[]> = ref([]);

const timerInfo = () => {
  Toast.show({
    text: 'Subiendo al servidor, si tarda mucho comprueba tu conexión',
    position: 'center',
  });
};

const deleteCode = (index: number) => {
  Toast.show({
    text: 'aha',
  });
};

//#region Scan
const showBorder = ref(false);
const flashBorder = (succeded = true) => {
  scanSucceded.value = succeded;
  showBorder.value = true;
  setTimeout(() => (showBorder.value = false), 200);
};
const scanSucceded = ref(true);

const startScan = async () => {
  document.body.style.opacity = '0';
  document.body.style.background = 'transparent';
  await BarcodeScanner.hideBackground();
  BarcodeScanner.startScanning(
    {
      targetedFormats: [SupportedFormat.QR_CODE],
    },
    async (res, err) => {
      if (!err) {
        if (res.hasContent) {
          if (codes.value.find((code) => code.id === res.content)) {
            Toast.show({ text: 'ID ya escaneado', position: 'center' });
            Haptics.notification({
              type: NotificationType.Warning,
            });
            flashBorder(false);
            return;
          }
          scanAudio.play();
          if (uuidValidate(res.content) && uuidVersion(res.content) === 4) {
            codes.value.push({
              id: res.content,
              time: new Date(),
              status: 'pending',
            });
            Toast.show({
              text: `Escaneado ${res.content}`,
              position: 'center',
            });
            Haptics.notification({
              type: NotificationType.Success,
            });
            flashBorder(true);
            const { error } = await supabase.from('attendance').insert({
              attendant_id: res.content,
              created_by: user.value?.supabase.id,
              session,
              event,
            });
            if (error) {
              useToast({
                message: error.message + ';' + error.hint,
                color: 'danger',
              });
              const thisCode = codes.value.find(
                (c) => c.id === res.content
              ) as Code;
              thisCode.status = 'error';
              thisCode.error = error;
            } else {
              const thisCode = codes.value.find(
                (c) => c.id === res.content
              ) as Code;
              thisCode.status = 'uploaded';
            }
          } else {
            Toast.show({ text: 'ID no válido', position: 'center' });
            Haptics.notification({
              type: NotificationType.Error,
            });
            flashBorder(false);
            return;
          }
        } else {
          Toast.show({
            text: 'ERROR: Contenido no recibido',
            position: 'center',
          });
          Haptics.notification({
            type: NotificationType.Error,
          });
          flashBorder(false);
        }
      } else {
        Toast.show({ text: `ERROR: ${err}`, position: 'center' });
        Haptics.notification({
          type: NotificationType.Error,
        });
        flashBorder(false);
      }
    }
  );
};

const pauseScan = () => {
  BarcodeScanner.showBackground();
  document.body.style.opacity = '1';
  //@ts-expect-error Background exists and is string | undefined
  document.body.style.background = undefined;
  BarcodeScanner.stopScan();
};

const exitScan = () => {
  pauseScan();

  router.back();
};

App.addListener('backButton', exitScan);
App.addListener('pause', pauseScan);
App.addListener('resume', startScan);

onIonViewDidLeave(() => {
  App.removeAllListeners();
});
//#endregion

//#region Modal
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
  pauseScan();
};
const closeModal = () => {
  startScan();
  isModalOpen.value = false;
};
//#endregion

const showCodeError = (index: number) => {
  modalController.create({
    component: defineAsyncComponent(
      () => import('../components/JSONViewer.vue')
    ),
    componentProps: {
      data: codes.value.at(index)?.error,
    },
  });
};

onMounted(() => {
  // setInterval(() => flashBorder(Math.random() < 0.2 ? false : undefined), 1000);
  startScan();
});

// TODO When you move the toast out of the body, you need to execute the movement each time and remove the toast
// setInterval(() => (successToastOpen.value = !successToastOpen.value), 1000);

// ? It probably would be easier to make my own toast at this point xd
// ? Inline toast maybe would work here
</script>

<style scoped>
.border-enter-active,
.border-leave-active {
  transition: opacity 0.5s ease;
}

.border-enter-from,
.border-leave-to {
  opacity: 0;
}

.exit-button {
  position: absolute;
  bottom: 1rem;
  width: 90vw;
  left: 5vw;
}
</style>

<style>
ion-toast.success-toast {
  transform: translateY(-4rem);
  --width: 90vw;
}
</style>
