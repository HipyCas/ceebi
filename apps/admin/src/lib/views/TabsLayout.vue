<template>
  <ion-page>
    <div class="fab-flex">
      <ion-fab class="fab" @click="initScan()">
        <ion-fab-button :translucent="true">
          <ion-icon :md="barcode" :ios="barcodeOutline" />
        </ion-fab-button>
      </ion-fab>
    </div>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" href="/p/schedule">
          <ion-icon :md="calendar" :ios="calendarOutline" />
          <ion-label>Horario</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="attendance" href="/p/attendance">
          <ion-icon :md="search" :ios="searchOutline" />
          <ion-label>Attendance</ion-label>
        </ion-tab-button>

        <div style="width: 50px"></div>

        <ion-tab-button tab="notifications" href="/p/notifications">
          <ion-icon :md="chatbubbles" :ios="chatbubblesOutline" />
          <ion-label>Notifications</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="users" href="/p/users">
          <ion-icon :md="people" :ios="peopleOutline" />
          <ion-label>Users</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonFab,
  IonFabButton,
  actionSheetController,
} from '@ionic/vue';
import {
  search,
  searchOutline,
  barcode,
  barcodeOutline,
  chatbubbles,
  chatbubblesOutline,
  calendar,
  calendarOutline,
  people,
  peopleOutline,
} from 'ionicons/icons';

const initScan = async () => {
  const sessionSelected = (session: string) => {
    console.log(session);
  };

  (
    await actionSheetController.create({
      header: 'Seleccionar sesión',
      buttons: [
        {
          text: 'Miércoles 17.30 - 20.00',
          handler: () => sessionSelected('Miércoles 17.30 - 20.00'),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
      ],
    })
  ).present();
};
</script>

<style scoped>
.fab-flex {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100vw;
  height: 120px;
  align-items: center;
  justify-content: center;
}
</style>

<style>
.cancel-button {
  color: var(--ion-color-danger) !important;
}
</style>
