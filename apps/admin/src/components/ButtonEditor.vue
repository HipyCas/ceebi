<template>
  <div class="accordion">
    <ion-item button @click="open = !open">
      <ion-label>Button #1</ion-label>
      <!-- TODO Animate the icons instead of switching them -->
      <ion-icon
        slot="end"
        :md="open ? chevronUpOutline : chevronDownOutline"
        :ios="open ? chevronUpOutline : chevronDownOutline"
      ></ion-icon>
    </ion-item>
    <div v-show="open">
      <ion-item>
        <ion-input
          label="Nombre"
          label-placement="fixed"
          :value="modelValue.name"
          type="text"
          @ion-input="updateValue('name', $event.detail.value || '')"
        ></ion-input>
      </ion-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonIcon, IonInput } from '@ionic/vue';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: {
    name: string;
    link: string;
    icon: string;
  };
}>();

const open = ref(false);

const updateValue = (key: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

<style scoped>
.accordion {
  width: 100%;
}
</style>
