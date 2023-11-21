<template>
  <PageWrapper back>
    <ion-title class="ion-margin-top title" style="font-size: 30px">
      Configuración
    </ion-title>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Seguridad</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item lines="none" :disabled="!supportsBiometrics">
          <ion-label>Activar incio de sesión biométrico</ion-label>
          <ion-toggle
            :disabled="!supportsBiometrics"
            v-model="biometricsAreEnabled"
            @ionChange="toggleBiometrics($event)"
          ></ion-toggle>
        </ion-item>
        <ion-button
          fill="outline"
          expand="block"
          color="danger"
          @click="logout()"
        >
          Cerrar sesión
        </ion-button>
      </ion-card-content>
    </ion-card>
    <IonCard>
      <ion-card-content>
        <ion-item
          lines="none"
          button
          :detail="false"
          @click="openPermissions"
          :disabled="!isPlatform('capacitor')"
        >
          <ion-label>Cambiar permisos</ion-label>
          <ion-icon slot="end" :icon="openOutline"></ion-icon>
        </ion-item>
        <router-link to="/dev/logs">
          <ion-item lines="none" button :detail="true">
            <ion-label>Logs</ion-label>
            <!--ion-icon slot="end" :md="open" :ios="openOutline"></!--ion-icon-->
          </ion-item>
        </router-link>
      </ion-card-content>
    </IonCard>
    <IonButton
      class="umami--click--open-dev-settings"
      fill="clear"
      expand="block"
      @click="openDevSettings"
      >Ajustes y acciones de desarrollador</IonButton
    >
  </PageWrapper>
</template>

<script lang="ts" setup>
import {
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonIcon,
  alertController,
  modalController,
  useIonRouter,
  isPlatform,
} from '@ionic/vue';
import { NativeBiometric } from 'capacitor-native-biometric';
import DevSettingsModal from '../components/DevSettingsModal.vue';
import { openOutline, checkmarkCircleOutline } from 'ionicons/icons';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';
import PageWrapper from '../components/PageWrapper.vue';
import { getUser } from '../user';

const router = useIonRouter();
const logger = useLogger();

const user = getUser();

const supportsBiometrics = ref(false);
const biometricsAreEnabled = ref(false);

if (isPlatform('capacitor'))
  NativeBiometric.isAvailable().then(
    ({ isAvailable }) => (supportsBiometrics.value = isAvailable),
  );

// TODO in login you have to also check if biometrics is available, imagine that someone toggles on the option and the disables biometrics, it should't prompt them for biometrics
Preferences.get({
  key: 'ceebiAdmin.biometricsEnabled',
}).then((val) => {
  if (val.value) biometricsAreEnabled.value = true;
});

const toggleBiometrics = async (ev: any) => {
  console.info(ev);
  // In case they are toggling on the option
  if (supportsBiometrics.value) {
    if (ev.target.checked) {
      const verified = await NativeBiometric.verifyIdentity({
        reason: 'Verifica tu identidad para activar esta opción',
        title: 'Verifica tu identidad para activar esta opción',
      })
        .then(() => true)
        .catch(() => false);

      // If the user couldn't be verified, notify them and revert setting
      if (!verified) {
        alertController
          .create({
            message: 'No ha sido posible verificar la identidad',
            buttons: ['Aceptar'],
          })
          .then((alert) => alert.present());
        biometricsAreEnabled.value = false;
      } else {
        const prompt = await alertController.create({
          header: 'Contraseña',
          message:
            'Introduce tu contraseña para guardarla en el archivo seguro de claves',
          inputs: [
            {
              type: 'password',
              placeholder: 'Contraseña',
            },
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Guardar',
              handler: ({ 0: input_password }: { 0: string }) => {
                if (input_password === '') return;
                // User has been succesfully verified, so save login info for next time and save preference
                NativeBiometric.setCredentials({
                  username: user.value?.wp.email || '',
                  password: input_password,
                  server: 'es.biociencias.admin',
                }).then(() =>
                  useToast({
                    message: 'Ajustes de autenticación guardados',
                    color: 'success',
                    icon: checkmarkCircleOutline,
                  }),
                );
                Preferences.set({
                  key: 'ceebiAdmin.biometricsEnabled',
                  value: 'true',
                });
              },
            },
          ],
        });
        prompt.present();
        console.log('eh?');
      }
    } else {
      // TODO Delete data from android's biometric keystore
      Preferences.remove({
        key: 'ceebiAdmin.biometricsEnabled',
      })
        .then(() =>
          useToast({
            message: 'Inicio de sesión biométrico desactivado',
            color: 'success',
            icon: checkmarkCircleOutline,
          }),
        )
        .catch((error) => {
          logger.error(
            'settings:toggleBiometrics',
            'error when deactivating biometrics',
            { error },
          );
        });
    }
  }
};

const logout = () => {
  user.value = null;
  router.push('/auth');
};

const openDevSettings = async () => {
  modalController
    .create({
      // component: (await (async () =>
      //   import('../components/DevSettingsModal.vue'))()) as ComponentRef,
      component: DevSettingsModal,
      showBackdrop: true,
      backdropDismiss: false,
    })
    .then((modal) => modal.present());
};

const openPermissions = () => {
  NativeSettings.open({
    optionAndroid: AndroidSettings.ApplicationDetails,
    optionIOS: IOSSettings.App,
  });
};

watch(supportsBiometrics, (val) => {
  logger.trace(
    'settings:watch(supportsBiometrics)',
    'changed supports biometrics',
    val,
  );
});
</script>

<style scoped>
.title.ios {
  position: absolute !important;
  top: 0;
  left: 0;
  display: block;
  overflow: visible;
  padding: 0;
}

.title.ios > * {
  overflow-x: visible;
}
</style>
