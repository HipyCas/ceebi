<template>
  <ion-page>
    <ion-content>
      <form class="main" @submit.prevent="login()">
        <ion-img :src="logoBlanco" class="img"></ion-img>
        <ion-item lines="full" class="item">
          <ion-label position="floating">Nombre de usuario</ion-label>
          <ion-input v-model="username"></ion-input>
        </ion-item>
        <ion-item lines="full" class="item">
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>
        <ion-button
          expand="block"
          class="button"
          @_click="login()"
          type="submit"
          >Acceder</ion-button
        >
        <!-- TODO Add button to login with biometrics -->
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonImg,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  alertController,
  useIonRouter,
  onIonViewWillEnter,
  onIonViewDidEnter,
} from '@ionic/vue';
import logoBlanco from '@/../public/assets/logo_horizontal_blanco.png';
import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { Preferences } from '@capacitor/preferences';
import { user } from '@/lib/user';
import { ref } from 'vue';

console.log('SETUP');

const router = useIonRouter();

const username = ref('');
const password = ref('');

onIonViewWillEnter(() => {
  username.value = '';
  password.value = '';
});

onIonViewDidEnter(() => {
  Preferences.get({
    key: 'ceebiAdmin.biometricsEnabled',
  }).then((res) => {
    if (res.value || '' != '') verifyWithBiometrics();
  });
});

const getBiometricType = (type: BiometryType) => {
  switch (type) {
    case BiometryType.FACE_AUTHENTICATION:
      return 'reconocimiento facial';
    case BiometryType.FACE_ID:
      return 'Face ID';
    case BiometryType.FINGERPRINT:
      return 'huella dactilar';
    case BiometryType.IRIS_AUTHENTICATION:
      return 'escaner de iris';
    case BiometryType.MULTIPLE:
      return 'método biológico';
    case BiometryType.TOUCH_ID:
      return 'Touch ID';
  }
};

const verifyWithBiometrics = async () => {
  console.log('ASYNC MAIN');

  const res = await NativeBiometric.isAvailable();
  console.log('AUTH TYPE', res.biometryType);

  if (!res.isAvailable)
    (
      await alertController.create({
        message: 'Biometrics not available',
      })
    ).present();

  console.log('STARTED VERIFICATION');
  const verified = await NativeBiometric.verifyIdentity({
    reason: 'Quicker login',
    title: `Acceder con ${getBiometricType(res.biometryType)}`,
    subtitle: '',
    description: 'Maybe a description too?',
  })
    .then(() => true)
    .catch(() => false);
  console.log('VERIFIED', verified);
  if (!verified)
    (
      await alertController.create({
        message: 'Could not verify identity',
      })
    ).present();
  else
    NativeBiometric.getCredentials({
      server: 'es.biociencias.admin',
    }).then(({ username: thisUsername, password: thisPassword }) => {
      username.value = thisUsername;
      password.value = thisPassword;
      login();
    });
};

// Preferences.get({
//   key: 'ceebiAdmin.biometricsEnabled',
// }).then((res) => {
//   if (res.value || '' != '') verifyWithBiometrics();
// });

function login() {
  user.value = {
    username: username.value,
    password: password.value,
  };
  router.push('/p/notifications');
}
</script>

<style scoped>
.main {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.img {
  width: 50%;
  margin-bottom: 1.5rem;
}

.button {
  width: 60%;
  margin-top: 1.5rem;
}

.item {
  --background: var(--ion-background-color);
  width: 60%;
}
</style>
