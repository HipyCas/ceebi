<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <div class="center-content">
        <canvas id="qrcode" height="300" width="300" v-show="user"></canvas>
        <template v-if="false && loadingUser">
          <PlainLoading :text="`${$t('auth.loggingIn')}...`" />
        </template>
        <ion-button v-else-if="user" class="asistencia" @click="openJesus">{{
          $t('attendance.viewAttendance')
        }}</ion-button>
        <LoginRequired
          v-else
          :reason="$t('attendance.reasonLoginRequired')"
        ></LoginRequired>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
  onIonViewDidEnter,
} from '@ionic/vue';
import Header from '../components/Header.vue';
import AttendanceModal from '../components/AttendanceModal.vue';
import QRCode from 'qrcode';
import { getUser, loadingUser } from '../user';
import { PlainLoading } from '@code/ceebi-ui';
import { watchOnce } from '@vueuse/core';
import LoginRequired from '../components/LoginRequired.vue';

const logger = useLogger();

const user = getUser();

const showQR = ref(false);

const openJesus = async () => {
  const modal = await modalController.create({
    component: AttendanceModal, // TODO Update too
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

watchOnce(loadingUser, () => {
  genCode();
});

// #region BRIGHTNESS
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
//#endregion
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
