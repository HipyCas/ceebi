<template>
  <PageWrapper :title="'Relación correos-IDs'" :back="true">
    <main class="px-5">
      <h1>Relación correos-IDs</h1>
      <p>
        Lista basada en todos los usuarios de WP relacionando su correo a su ID
        de Supabase (para asistencia)
      </p>
      <IonButton @click="shareCSV" class="my-3" expand="block" color="dark"
        >Compartir CSV
        <IonIcon slot="end" :icon="shareSocialOutline"></IonIcon>
      </IonButton>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.email }} -> {{ user.acf.id_base_de_datos_app }}
        </li>
      </ul>
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../../components/PageWrapper.vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { authHeaders } from '../../wpauth';
import { wpapi } from '../../req';
import { encode } from 'js-base64';
import { shareSocialOutline } from 'ionicons/icons';

const users = ref([] as WPUser[]);
const loading = ref(true);

(async () => {
  const res = await wpapi.get(
    'wp/v2/users?context=edit&per_page=100&_files=email,acf.id_base_de_datos_app',
    {
      headers: authHeaders({}),
    }
  );
  const total_pages = Number.parseInt(
    res.headers.get('X-WP-TotalPages') || '0'
  );
  console.info('[UPDATE USERS] Total pages:', total_pages);
  users.value.push(...(await res.json<WPUser[]>()));

  for (let page = 1; page <= total_pages; page++) {
    const res = await wpapi.get(
      `wp/v2/users?context=edit&per_page=100&page=${page}&_files=email,acf.id_base_de_datos_app`,
      {
        headers: authHeaders({}),
      }
    );
    console.log('[UPDATE USERS] Fetched page ' + page, res);
    users.value.push(...(await res.json<WPUser[]>()));
  }

  loading.value = false;
})();

const shareCSV = async () => {
  const data = encode(
    'correo,id\n' +
      users.value
        .map((u) => `${u.email},${u.acf.id_base_de_datos_app}`)
        .join('\n')
  );
  await Filesystem.writeFile({
    path: 'users.csv',
    data,
    directory: Directory.Cache,
  });
  const file = await Filesystem.getUri({
    path: 'users.csv',
    directory: Directory.Cache,
  });
  Share.share({
    dialogTitle: 'Relación correos-IDs',
    files: [file.uri],
  });
};
</script>
