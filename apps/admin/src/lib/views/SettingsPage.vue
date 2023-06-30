<template>
  <IonPage>
    <ion-content>
      <ion-title class="ion-margin-top title" style="font-size: 30px">
        Configuración
      </ion-title>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Seguridad</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none" :disabled="supportsBiometrics">
            <ion-label>Activar incio de sesión biométrico</ion-label>
            <ion-toggle
              :disabled="supportsBiometrics"
              v-model="enableBiometrics"
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
    </ion-content>
  </IonPage>
</template>

<script lang="ts" setup>
import { user } from '@/lib/user';
import { Preferences } from '@capacitor/preferences';
import {
  IonPage,
  IonContent,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  toastController,
  alertController,
  useIonRouter,
} from '@ionic/vue';
import { NativeBiometric } from 'capacitor-native-biometric';
import { ref, watch } from 'vue';

const router = useIonRouter();

const supportsBiometrics = ref(true);
const enableBiometrics = ref(false);

NativeBiometric.isAvailable().then(
  ({ isAvailable }) => (supportsBiometrics.value = !isAvailable)
);

// TODO in login you have to also check if biometrics is available, imagine that someone toggles on the option and the disables biometrics, it should't prompt them for biometrics
Preferences.get({
  key: 'ceebiAdmin.biometricsEnabled',
}).then((val) => {
  if (val.value || '' !== '') enableBiometrics.value = true;
});

const toggleBiometrics = async (ev: any) => {
  console.info(ev);
  // In case they are toggling on the option
  if (enableBiometrics.value) {
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
      enableBiometrics.value = false;
    } else {
      // User has been succesfully verified, so save login info for next time and save preference
      NativeBiometric.setCredentials({
        username: user.value?.username || '',
        password: user.value?.password || '',
        server: 'es.biociencias.admin',
      }).then(() =>
        toastController
          .create({
            message: 'Ajustes de autenticación guardados',
            duration: 1500,
          })
          .then((toast) => toast.present())
      );
      Preferences.set({
        key: 'ceebiAdmin.biometricsEnabled',
        value: 'true',
      });
    }
  }
};

const logout = () => {
  user.value = null;
  router.push('/auth');
};
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
