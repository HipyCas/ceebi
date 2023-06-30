<template>
  <ion-page>
    <ion-content>
      <main
        class="overflow-hidden text-center flex flex-col justify-center items-center h-full w-full"
      >
        <h2>Inicia sesión</h2>
        <ion-text class="w-[75%]" color="medium">
          Accede con tu cuenta del CEEBI (biociencias.es) a la app para
          registrar tu asistencia y ver sólo para asistentes
        </ion-text>

        <LoginForm
          button-text="Iniciar sesión"
          @login="login"
          @continue="continueToApp"
        ></LoginForm>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonText, loadingController } from '@ionic/vue';
import LoginForm from '../../components/LoginForm.vue';
import { wpLogin } from '../../wpauth';
import { closeCircleOutline } from 'ionicons/icons';

const router = useIonRouter();
const { t } = useI18n();
const logger = useLogger();

const continueToApp = () => router.push('/notifications');

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const loading = await loadingController.create({
    message: t('auth.loggingIn'),
  });
  loading.present();

  wpLogin(username, password)
    .then(() => {
      logger.info('auth:login', 'logged in with username', username);
      loading.dismiss();
      continueToApp();
    })
    .catch((e) => {
      logger.error('auth:login', 'error logging in for username', username, {
        error: e,
      });
      loading.dismiss();
      useToast({
        message: 'Error logging in',
        icon: closeCircleOutline,
        color: 'danger',
      });
    });
};
</script>

<style scoped>
.wrap {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
</style>
