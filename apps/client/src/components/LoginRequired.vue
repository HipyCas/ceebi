<template>
  <img :src="AccessSVG" class="w-7/12 mb-6" />
  <ion-label class="w-8/12 text-center" v-once
    >{{ $t('auth.loginToReason') }} {{ reason }}</ion-label
  >
  <ion-button class="ion-margin-top" router-link="/auth/login">{{
    $t('auth.login')
  }}</ion-button>
</template>

<script setup lang="ts">
import { IonLabel, IonButton } from '@ionic/vue';
import AccessSVG from '../../public/assets/undraw_access_account_re_8spm.svg';

defineProps<{
  reason: string;
}>();
</script>
