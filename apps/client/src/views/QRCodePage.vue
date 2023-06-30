<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <div class="center-content">
        <canvas id="qrcode" height="300" width="300" v-show="user"></canvas>
        <ion-button v-if="user" class="asistencia" @click="openJesus">{{
          $t('message.viewAttendance')
        }}</ion-button>
        <template v-else>
          <img :src="AccessSVG" class="w-7/12 mb-6" />
          <ion-label class="w-9/12 text-center"
            >Inicia sesión para poder registrar la asistencia</ion-label
          >
          <router-link to="/auth/login">
            <ion-button class="ion-margin-top" router-link="/id-change"
              >Inicia sesión</ion-button
            >
          </router-link>
        </template>
        <!-- TODO Comprobar letra DNI con el algoritmo de comprobación: dni_del_numero / 23 -> tomas resto -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
  onIonViewDidEnter,
} from '@ionic/vue';
import AccessSVG from '../../public/assets/undraw_access_account_re_8spm.svg';
import Header from '../components/Header.vue';
import AttendanceModal from '../components/AttendanceModal.vue';
import QRCode from 'qrcode';
import { getUser } from '../user';

const logger = useLogger();

const user = getUser();

const showQR = ref(false);

const openJesus = async () => {
  const modal = await modalController.create({
    component: AttendanceModal, // TODO Update too
    // componentProps: {
    //   id: user.value,
    // },
  });
  modal.present();
};

function genCode() {
  console.log(
    'rendering code',
    document.getElementById('qrcode'),
    user.value.acf.id_base_de_datos_app
  );
  QRCode.toCanvas(
    document.getElementById('qrcode'),
    user.value.acf.id_base_de_datos_app,
    {
      scale: Math.min(screen.width / 30, 10),
      margin: 2,
    }
  )
    .then(() => {
      console.log('redenred code');
      showQR.value = true;
    })
    .catch((e) =>
      logger.error('qrcode:genCode', 'error thrown by code generator', e)
    );
}

const main = async () => {
  console.log('main');
  if (user.value) {
    console.log('rendering code');
    genCode();
    console.log('rendered code');
    showQR.value = true;
  } else {
    console.log('no gen');
  }
};

main();

//* BRIGHTNESS
const brightness = ref(0);
(async () => {
  if (isPlatform('capacitor')) {
    const { brightness: _brightness } = await ScreenBrightness.getBrightness();
    brightness.value = _brightness;
  }
})();
onIonViewWillEnter(async () => {
  if (isPlatform('capacitor'))
    ({ brightness: brightness.value } = await ScreenBrightness.getBrightness());
  main(); // Check for ID and load QR if needed
});
onIonViewWillLeave(() => {
  if (isPlatform('capacitor'))
    ScreenBrightness.setBrightness({
      brightness: brightness.value,
    });
});
onIonViewDidEnter(() => {
  if (isPlatform('capacitor') && user.value)
    ScreenBrightness.setBrightness({
      brightness: 1,
    });
});
//* ===========
</script>

<style scoped>
.center-content {
  top: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#qrcode {
  border-radius: 15px;
}

.asistencia {
  position: absolute;
  bottom: 80px;
}
</style>
