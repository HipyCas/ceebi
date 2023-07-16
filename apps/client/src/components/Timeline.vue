<template>
  <div id="vertical-bar"></div>
  <section class="events">
    <article v-for="event in events" :key="event.id" class="event">
      <div class="event__icon">
        <ion-icon :icon="icon(event)"></ion-icon>
      </div>
      <div class="event__header" v-wave @click="eventModal(event)">
        <p class="event__start-time">
          {{ event.startTime }}
        </p>
        <h3 class="event__title">
          {{ event.title }}
        </h3>
      </div>
      <p class="event__presenter">
        {{ event.speakers.map((speaker) => speaker.name).join(', ') }}
        {{ event.locations.length > 0 && event.speakers.length > 0 ? '-' : '' }}
        {{ (event.locations.at(0) ?? { name: '' }).name }}
      </p>
      <p class="event__description">{{ event.excerpt }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { IonIcon, modalController } from '@ionic/vue';
import * as ionicons from 'ionicons/icons';
import type { Event } from '@wupp/mec-ts';
import { EVENT_ICON_FIELD_LABEL } from '../vars';
import EventDetailsModalVue from './EventDetailsModal.vue';

defineProps<{
  events: Event[];
}>();

const icon = computed(() => {
  return (event: Event): string => {
    //@ts-expect-error Index types don't match
    return ionicons[
      `${
        (
          event.fields.find((el) => el.label === EVENT_ICON_FIELD_LABEL) || {
            value: '',
          }
        ).value
      }Outline`
    ];
  };
});

async function eventModal(event: Event) {
  const modal = await modalController.create({
    component: EventDetailsModalVue,
    breakpoints: [0, 0.45, 0.75, 1],
    initialBreakpoint: 1,
    componentProps: { event },
  });
  modal.present();
}
</script>

<style scoped>
#vertical-bar {
  left: 2em;
  top: 0;
  position: absolute;
  width: 10px;
  height: 100%;
  background: var(--ion-color-secondary-shade);
}

.events {
  padding: 2em;
}

.event {
  padding-left: 30px;
  padding-top: 5px;
  position: relative;
}

.event__icon {
  position: absolute;
  left: -15px;
  background-color: var(--ion-color-secondary-tint);
  border-radius: 9999px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #111;
}

.event__header {
  margin: 3px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 0.25em;
  font-size: 1.5rem;
  position: relative;
}

.event__header > * {
  margin: 0;
}

.event__start-time {
  font-weight: bolder;
  color: var(--ion-color-primary-shade);
}

.event__title {
  font-weight: 1000;
  margin-bottom: 0;
}

.event__presenter {
  font-size: 1rem;
  font-weight: bolder;
  color: #888;
  margin: 0;
}

.event__description {
  margin-top: 0.2em;
  color: #111 !important;
}

body.dark .event__description {
  color: #efefef !important;
}
</style>
