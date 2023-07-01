<template>
  <ion-page>
    <ion-content>
      <main>
        <form @submit.prevent="login()">
          <ion-img :src="isDark ? logoBlanco : logoNegro" class="img"></ion-img>
          <ion-item lines="full" class="item" :class="emailItemClass">
            <ion-input
              id="email"
              v-model="email"
              type="email"
              label="Email"
              label-placement="floating"
              autocomplete="username"
            ></ion-input>
          </ion-item>
          <ion-item lines="full" class="item">
            <ion-input
              id="password"
              v-model="password"
              type="password"
              label="Contraseña"
              label-placement="floating"
              autocomplete="current-password"
              aria-describedby="password-constraints"
              required
            ></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            class="button"
            @_click="login()"
            type="submit"
            >Acceder</ion-button
          >
          <!-- TODO Add button to login with biometrics -->
          <ion-button
            @click="verifyWithBiometrics"
            fill="clear"
            color="secondary"
            expand="block"
          >
            Iniciar con huella/facial
          </ion-button>
        </form>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonImg,
  IonButton,
  alertController,
  loadingController,
  toastController,
} from '@ionic/vue';
import {
  alertCircleOutline,
  closeCircleOutline,
  shieldHalfOutline,
} from 'ionicons/icons';
import logoBlanco from '../../assets/logo_horizontal_blanco_compressed_70px.png';
import logoNegro from '../../assets/logo_horizontal.png';
import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { wpapi } from '../../req';
import type { HTTPError } from 'ky';
import type { WPJWTResponse } from '../../wpauth';
import { setWPToken, authHeaders } from '../../wpauth';
import { setUser } from '../../user';
import { useSupabase } from '@code/supabase';

const log = useLogger();
log.trace('auth', 'setup');

const router = useIonRouter();
const supabase = useSupabase();
const route = useRoute();

const isDark = ref(false);
onMounted(() => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
    isDark.value = true;
});

const email = ref('');
const password = ref('');

onIonViewWillEnter(() => {
  email.value = '';
  password.value = '';
});

onIonViewDidEnter(() => {
  Preferences.get({
    key: 'ceebiAdmin.biometricsEnabled',
  }).then((res) => {
    log.trace(
      'auth',
      'ceebiAdmin.biometricsEnabled preferences value',
      res.value
    );
    if (res.value || '' != '') verifyWithBiometrics();
  });
});

const getBiometricType = (type: BiometryType) => {
  switch (type) {
    case BiometryType.FACE_AUTHENTICATION:
      return 'reconocimiento facial';
    case BiometryType.FACE_ID:
      return 'Face ID';
    case BiometryType.FINGERPRINT:
      return 'huella dactilar';
    case BiometryType.IRIS_AUTHENTICATION:
      return 'escaner de iris';
    case BiometryType.MULTIPLE:
      return 'método biológico';
    case BiometryType.TOUCH_ID:
      return 'Touch ID';
  }
};

const verifyWithBiometrics = async () => {
  log.trace('auth:verifyWithBiometrics', 'start');

  let res;
  try {
    res = await NativeBiometric.isAvailable();
    log.trace('auth:verifyWithBiometrics', 'Biometric Type', res.biometryType);

    if (!res.isAvailable) {
      (
        await alertController.create({
          message: 'Biometrics not available',
        })
      ).present();
      return;
    }
  } catch (e) {
    useToast({
      message: 'Biometrics not available',
      color: 'danger',
      icon: closeCircleOutline,
    });
    return;
  }

  log.trace('auth:verifyWithBiometrics', 'Starting Verification');
  const verified = await NativeBiometric.verifyIdentity({
    reason: 'Quicker login',
    title: `Acceder con ${getBiometricType(res.biometryType)}`,
    subtitle: '',
    description: 'Maybe a description too?',
  })
    .then(() => true)
    .catch(() => false);
  console.log('VERIFIED', verified);
  if (!verified)
    (
      await alertController.create({
        message: 'No se ha podido comprobar la identidad',
      })
    ).present();
  else
    NativeBiometric.getCredentials({
      server: 'es.biociencias.admin',
    }).then(({ username: thisUsername, password: thisPassword }) => {
      log.trace(
        'auth:verifyWithBiometrics',
        'Verified identity, credentials',
        thisUsername,
        thisPassword
      );
      email.value = thisUsername;
      password.value = thisPassword;
      login();
    });
};

// Preferences.get({
//   key: 'ceebiAdmin.biometricsEnabled',
// }).then((res) => {
//   if (res.value || '' != '') verifyWithBiometrics();
// });

const emailItemClass = computed(() =>
  email.value.length > 0
    ? email.value.match(
        /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      )
      ? 'ion-valid'
      : 'ion-invalid'
    : ''
);

async function login() {
  // const data = await supabase.auth.signInWithPassword({
  //   email: username.value,
  //   password: password.value,
  // });
  // supabase.auth
  //   .signUp({
  //     email: username.value,
  //     password: password.value,
  //   })
  //   .then((res) => console.info(res));

  log.trace('auth:login', 'start login', email.value);

  const loading = await loadingController.create({
    message: 'Iniciando sesión',
  });
  loading.present();

  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: username.value,
  //   password: password.value,
  // });

  const { data: supabase_user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.value)
    .single();

  if (supabase_user === null || error) {
    log.error('auth:login', 'supabase error', supabase_user, error);
    useToast({
      message: 'Usuario no encontrado',
      color: 'danger',
      cssClass: '',
    });
    loading.dismiss();
    return;
  }

  if (!supabase_user?.is_admin) {
    useToast({
      message: 'App restringida a administradores',
      color: 'danger',
      cssClass: '',
      icon: shieldHalfOutline,
      buttons: [
        {
          text: 'Más info',
          handler: () =>
            Browser.open({
              url: 'https://biociencias.es',
            }),
        },
      ],
    });
    loading.dismiss();
    return;
  }

  try {
    const res = await wpapi
      .post('jwt-auth/v1/token', {
        json: {
          username: email.value,
          password: password.value,
        },
        // throwHttpErrors: false,
      })
      .json<WPJWTResponse>();

    // user.value = {
    //   username: username.value,
    //   password: password.value,
    // };

    setWPToken(res.token);
    setUser({
      wp: await wpapi
        .get(`wp/v2/users/me?context=edit`, {
          headers: authHeaders({}),
        })
        .json<WPUser>(),
      supabase: supabase_user,
    });

    router.push(
      route.query.next === undefined
        ? '/p/notifications'
        : route.query.next + '?back=/p/notifications'
    );
  } catch (error) {
    console.log(
      'error stuff',
      (error as HTTPError).response.json(),
      JSON.stringify((error as HTTPError).response.json())
    );
    toastController
      .create({
        message: 'Email or password incorrect',
        duration: 1000,
        color: 'danger',
        icon: alertCircleOutline,
      })
      .then((toast) => toast.present());
  } finally {
    loading.dismiss();
  }
}
</script>

<style scoped>
main {
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: center;
  /* flex-direction: column; */
  /* gap: 1rem; */
}

form {
  width: 60%;
}

form > *:not(:first-child) {
  margin-top: 1rem;
}

.img {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1.5rem;
}

.button {
  /* width: 60%; */
  margin-top: 1.5rem !important;
}

.item {
  --background: var(--ion-background-color);
  /* width: 60%; */
}
</style>
