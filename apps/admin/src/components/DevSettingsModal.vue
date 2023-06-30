<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="danger" @click="cancel()">Cancel</ion-button>
      </ion-buttons>
      <ion-title>Welcome</ion-title>
      <ion-buttons slot="end">
        <ion-button :strong="true" @click="save()">Save</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item v-for="setting in settings" :key="setting.name">
      <ion-label>{{ setting.name }}</ion-label>
      <IonToggle
        v-if="setting.type === 'bool'"
        slot="end"
        v-model="setting.value"
      ></IonToggle>
    </ion-item>
    <router-link to="/dev/update-users" @click="cancel()">
      <IonButton expand="block">Check users sync</IonButton>
    </router-link>
    <router-link to="/dev/icon-list" @click="cancel()">
      <IonButton expand="block">Open the Icon List</IonButton>
    </router-link>
    <router-link to="/dev/email-id" @click="cancel()">
      <IonButton expand="block">See email to DB ID relation</IonButton>
    </router-link>
    <router-link to="/dev/notifications-import" @click="cancel()">
      <IonButton expand="block">Importar notificaciones</IonButton>
    </router-link>
  </ion-content>
</template>

<script setup lang="ts">
import { Preferences } from '@capacitor/preferences';
import {
  isPlatform,
  modalController,
  toastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonToggle,
} from '@ionic/vue';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { ref, watch } from 'vue';

const cancel = modalController.dismiss;
const save = () => {
  // settings.value.forEach(({ name, value }) => {
  //   Preferences.set({
  //     key: `ceebiAdmin.settings.dev.${name.toLowerCase().replace(/ /g, '_')}`,
  //     value: JSON.stringify(value), // TODO Load on app open
  //   });
  // });
  modalController.dismiss();
};

const settings = ref([
  {
    name: isPlatform('ios') ? 'Android UI' : 'iOS UI',
    type: 'bool',
    value: false,
  },
] as {
  name: string;
  type: 'bool';
  value: any;
}[]);

Preferences.get({
  key: 'ceebiAdmin.mode',
}).then(
  ({ value }) =>
    (settings.value[0].value =
      value === 'ios'
        ? !isPlatform('ios')
        : value === 'md'
        ? !(isPlatform('android') || isPlatform('desktop'))
        : false)
);

watch(
  () => settings.value[0],
  ({ value }) => {
    console.info('incredible,', value);
    let targetMode: 'ios' | 'md';
    if (value) targetMode = isPlatform('ios') ? 'md' : 'ios';
    else targetMode = isPlatform('ios') ? 'ios' : 'md';

    document.body.parentElement?.setAttribute('mode', targetMode);
    Preferences.set({
      key: 'ceebiAdmin.mode',
      value: targetMode,
    });

    toastController
      .create({
        message: 'Settings saved successfully',
        color: 'success',
        icon: checkmarkCircleOutline,
        duration: 1500,
      })
      .then((toast) => toast.present());
  },
  { deep: true }
);
</script>
