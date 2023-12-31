<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ event.title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">{{ $t('ui.close') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <div class="wrapper">
      <div class="info-item">
        <ion-icon :icon="calendarOutline"></ion-icon>
        <span style="text-transform: capitalize">{{
          // dayFormat(event.data.time.start_timestamp)
          dayFormat2(event.startDate)
        }}</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="timeOutline"></ion-icon>
        <span
          >{{ /* event.data.time.start */ event.startTime }} -
          {{ /* event.data.time.end */ event.endTime }}</span
        >
      </div>
      <div class="info-item">
        <ion-icon :icon="locationOutline"></ion-icon>
        <span>{{
          event.locations.at(0)?.name || $t('schedule.eventNoLocation')
        }}</span>
      </div>
      <div class="info-item">
        <ion-icon :icon="pricetagOutline"></ion-icon>
        <span>{{ event.categories.at(0)?.name }}</span>
      </div>

      <ion-text v-html="event.contentHTML"></ion-text>

      <ion-accordion-group
        class="ion-margin-top !mx-0"
        v-if="event.speakers.length > 0"
        expand="inset"
      >
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-icon slot="start" :icon="peopleOutline"></ion-icon>
            <ion-label>{{ $t('schedule.eventSpeakers') }}</ion-label>
          </ion-item>
          <ion-list slot="content">
            <ion-item
              v-for="speaker in event.speakers"
              :key="speaker.id"
              lines="none"
            >
              <ion-avatar slot="start">
                <img :src="speaker.thumbnail" alt="" />
              </ion-avatar>
              <ion-label>{{ speaker.name }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

      <ion-item
        lines="none"
        class="ion-margin-top"
        fill="outline"
        :href="event.link"
        target="_blank"
        :detail="false"
      >
        <ion-label>{{ $t('schedule.eventViewOnWeb') }}</ion-label>
        <ion-icon slot="end" :icon="openOutline"></ion-icon>
      </ion-item>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { Event } from '@wupp/mec-ts';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  IonText,
  IonAvatar,
  modalController,
} from '@ionic/vue';
import {
  locationOutline,
  timeOutline,
  pricetagOutline,
  peopleOutline,
  openOutline,
  calendarOutline,
} from 'ionicons/icons';

defineProps<{
  event: Event;
}>();

function dismissModal() {
  modalController.dismiss();
}

function dayFormat2(date: Date) {
  return date.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.wrapper {
  padding: 1.75rem 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  height: 20px;
  margin-bottom: 16px;
}

.info-item:last-of-type {
  margin-bottom: 25px;
}

.info-item > ion-icon {
  font-size: 24px;
  --ionicon-stroke-width: 46px;
  color: var(--ion-color-primary);
}

.info-item > span {
  color: #444;
}

body.dark .info-item > span {
  color: #ccc;
}
</style>
