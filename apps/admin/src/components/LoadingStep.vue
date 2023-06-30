<template>
  <ion-item lines="none" @click.prevent :button="false">
    <template v-if="stepStatus === 0">
      <ion-spinner></ion-spinner>
      &nbsp;
    </template>
    <ion-checkbox
      v-else
      mode="ios"
      :checked="stepStatus === 1"
      readonly
    ></ion-checkbox>
    {{ text }}...
  </ion-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonItem, IonCheckbox, IonSpinner } from '@ionic/vue';

const props = defineProps<{
  currentStep: number;
  targetStep: number;
  text: string;
}>();

const stepStatus = computed(() => {
  if (props.currentStep === props.targetStep) return 0;
  else if (props.currentStep > props.targetStep) return 1;
  else return -1;
});
</script>
