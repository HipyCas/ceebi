<template>
  <IonButton
    expand="block"
    color="dark"
    @click="shareLogs(logger, exportFileName)"
  >
    Compartir
    <IonIcon :icon="shareSocialOutline" slot="end"></IonIcon>
  </IonButton>

  <IonList class="my-3 bg-opacity-0 bg-transparent">
    <IonItem
      v-for="log in logger.stream"
      :key="log.time + log.scope"
      lines="full"
      :color="logColor(log)"
      class="relative"
    >
      <IonIcon :icon="logIcon(log)" slot="start"></IonIcon>
      <IonText
        class="mr-2 overflow-ellipsis w-min"
        :style="{ color: logScopeColor(log) }"
        >{{ log.scope }}</IonText
      >{{ log.parts.join(' ') }}
      <IonNote class="absolute top-0.5">{{ formatISO9075(log.time) }}</IonNote>
      <IonButton slot="end" color="light" @click="openLog(log)"
        ><IonIcon slot="icon-only" :icon="codeOutline"></IonIcon
      ></IonButton>
    </IonItem>
  </IonList>
</template>

<script setup lang="ts">
// import { LogLevel } from '@code/logger';
import { LogLevel } from '../../../logger/src';
import type { Logger, Msg as LoggerMsg } from '../../../logger/src';
import {
  IonIcon,
  IonItem,
  IonList,
  IonText,
  IonNote,
  IonButton,
  modalController,
} from '@ionic/vue';
import {
  bugOutline,
  informationCircleOutline,
  warningOutline,
  closeCircleOutline,
  codeOutline,
  shareSocialOutline,
} from 'ionicons/icons';
import JSONViewer from './JSONViewer.vue';
import formatISO9075 from 'date-fns/formatISO9075';
import uniqolor from 'uniqolor';
import { shareLogs } from '../';

const props = defineProps<{
  logger: Logger;
  exportFileName: string;
}>();

// const computedStream = toRef(logger, 'stream');
// watch(computedStream, () => console.log('change', computedStream));
// const reactiveLogger = reactive(logger);

const logIcon = (msg: LoggerMsg) => {
  switch (msg.level) {
    case LogLevel.Trace:
      return bugOutline;
    case LogLevel.Info:
      return informationCircleOutline;
    case LogLevel.Warn:
      return warningOutline;
    case LogLevel.Error:
      return closeCircleOutline;
    default:
      return '';
  }
};

const logColor = (msg: LoggerMsg) => {
  switch (msg.level) {
    case LogLevel.Trace:
      return '';
    case LogLevel.Info:
      return 'light';
    case LogLevel.Warn:
      return 'warning';
    case LogLevel.Error:
      return 'danger';
    default:
      return '';
  }
};

const logScopeColor = (msg: LoggerMsg) => {
  console.log(msg.scope, uniqolor(msg.scope.split(':')[0]).color);
  return uniqolor(msg.scope.split(':')[0]).color;
};

// TODO Make inline modal
const openLog = (msg: LoggerMsg) => {
  modalController
    .create({
      component: JSONViewer,
      componentProps: {
        data: msg,
      },
    })
    .then((m) => m.present());
};
</script>
