<template>
  <ion-input
    class="input-item"
    style="margin-top: 1.5rem"
    fill="outline"
    :label="$t('auth.email')"
    label-placement="floating"
    type="email"
    v-model="username"
  ></ion-input>
  <ion-input
    class="input-item"
    style="margin-top: 0.5rem"
    fill="outline"
    :label="$t('auth.password')"
    label-placement="floating"
    type="password"
    v-model="password"
  ></ion-input>

  <ion-button color="primary" style="margin-top: 1.5rem" @click="login">
    {{ buttonText }} </ion-button
  ><ion-button
    color="secondary"
    fill="clear"
    style="margin-top: 0.5rem"
    @click="emit('continue')"
  >
    {{ $t('auth.continueWithoutLogin') }}
  </ion-button>

  <ion-text class="notice slide-text">
    <p v-html="$t('auth.privacyPolicyAcceptance')"></p>
  </ion-text>
</template>

<script setup lang="ts">
import { IonInput, IonButton, IonText } from '@ionic/vue';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

defineProps<{
  buttonText: string;
}>();

const emit = defineEmits<{
  login: [
    {
      username: string;
      password: string;
    }
  ];
  continue: [];
}>();

const username = ref('');
const password = ref('');

const login = () => {
  logEvent(analytics, 'login');
  emit('login', {
    username: username.value,
    password: password.value,
  });
};
</script>

<style scoped>
.slide-text {
  width: 75%;
}

.notice {
  margin-top: 0.5rem;
  font-size: 1rem;
  font-style: italic;
}

body .notice {
  color: #ccc;
}

body.dark .notice {
  color: #444;
}

.input-item {
  /* --background: var(--ion-background-color); */
  width: 60%;
}
</style>
