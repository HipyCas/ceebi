<template>
  <ion-item style="margin-top: 1.5rem" class="input-item">
    <ion-input
      fill="outline"
      label="Correo electrónico"
      label-placement="floating"
      type="email"
      v-model="username"
    ></ion-input>
  </ion-item>
  <ion-item style="margin-top: 0.5rem" class="input-item">
    <ion-input
      fill="outline"
      label="Contraseña"
      label-placement="floating"
      type="password"
      v-model="password"
    ></ion-input>
  </ion-item>

  <ion-button color="primary" style="margin-top: 1.5rem" @click="login">
    {{ buttonText }} </ion-button
  ><ion-button
    color="secondary"
    fill="clear"
    style="margin-top: 0.5rem"
    @click="emit('continue')"
  >
    Continuar sin iniciar sesión
  </ion-button>

  <ion-text class="notice slide-text">
    <p v-html="$t('auth.privacyPolicyAcceptance')"></p>
  </ion-text>
</template>

<script setup lang="ts">
import { IonItem, IonInput, IonButton, IonText } from '@ionic/vue';

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

const login = () =>
  emit('login', {
    username: username.value,
    password: password.value,
  });
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
  --background: var(--ion-background-color);
  width: 60%;
}
</style>
