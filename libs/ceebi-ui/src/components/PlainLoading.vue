<template>
  <div class="flex flex-row items-center justify-center w-full py-10">
    <IonSpinner
      :class="`h-${spinnerTailwindSize} w-${spinnerTailwindSize}`"
    ></IonSpinner>
    <IonLabel
      style="
        margin-left: 1.25rem /* 20px */;
        font-size: 1.125rem /* 18px */;
        line-height: 1.75rem; /* 28px */
      "
      >{{ text }}</IonLabel
    >
  </div>
</template>

<script setup lang="ts">
import { IonSpinner, IonLabel } from '@ionic/vue';

withDefaults(
  defineProps<{
    text?: string;
    spinnerTailwindSize?: number;
  }>(),
  {
    text: 'Loading...',
    spinnerTailwindSize: 10,
  }
);
</script>
