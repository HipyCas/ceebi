<template>
  <PageWrapper>
    <IonSearchbar
      class="ion-padding-top z-20"
      enterkeyhint="search"
      placeholder="Buscar usuarios"
      :search-icon="person"
      showClearButton="always"
      v-model="searchQuery"
    ></IonSearchbar>

    <PlainLoading
      v-if="loading"
      text="Cargando Usuarios"
      :spinner-tailwind-size="10"
    ></PlainLoading>
    <IonList>
      <RecycleScroller
        v-if="!loading"
        :items="filteredUsers"
        :item-size="47"
        :key-field="'id'"
        class="scroller"
        v-slot="{ item: user }"
      >
        <router-link
          :to="`/p/users/${user.id}/${user.name}`"
          direction="forward"
        >
          <ion-item button detail class="id-item h-47" lines="full">
            <ion-text>{{ user.name }}</ion-text>
          </ion-item>
        </router-link>
      </RecycleScroller>
    </IonList>

    <ion-fab
      @click="openJSON"
      v-if="!loading"
      slot="fixed"
      vertical="bottom"
      horizontal="end"
    >
      <ion-fab-button color="medium">
        <ion-icon :icon="codeOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </PageWrapper>
</template>

<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { RecycleScroller } from 'vue-virtual-scroller';

// TODO Alert if some users are out of sync with a banner on top
import { person, codeOutline } from 'ionicons/icons';
import { PlainLoading } from '@code/ceebi-ui';
import {
  alertController,
  modalController,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSearchbar,
} from '@ionic/vue';
import PageWrapper from '../components/PageWrapper.vue';
import { wpapi } from '../req';
import { authHeaders } from '../wpauth';
import type { HTTPError } from 'ky';
import { setListableUsers, getListableUsers } from '../listableUsers';
import { performance } from '../firebase';
import { trace } from 'firebase/performance';

const logger = useLogger();

const loading = ref(true);

const searchQuery = ref('');

const apiResponses: Array<Record<any, any>> = [];

const users = ref([] as WPUser[]);

// TODO When a user is created, it should also create an associated profile in 'profiles' table

// supabase
//   .from('profiles')
//   .select('id, first_name, last_name')
//   .then((res) => {
//     console.log('users response', res);
//     if (res.error) {
//       // TODO Move to ui package with propper offset and duration
//       toastController
//         .create({
//           message: 'Error while loading user list',
//           color: 'danger',
//           icon: alertCircleOutline,
//           duration: 2000,
//         })
//         .then((t) => t.present());
//     } else {
//       users.value = res.data.map(({ id, first_name, last_name }) => ({
//         id,
//         name: first_name + ' ' + last_name,
//       }));
//     }
//   });

const filteredUsers = computed(() =>
  users.value.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.value)
  )
);

const openJSON = async () =>
  modalController
    .create({
      component: defineAsyncComponent(
        () => import('../components/JSONViewer.vue')
      ),
      componentProps: {
        data: apiResponses,
      },
    })
    .then((modal) => modal.present());

onMounted(async () => {
  try {
    const listableUsers = getListableUsers();
    if (listableUsers.value.length > 0) return;

    const usersLoadTrace = trace(performance, 'loadAllUsersWP');
    usersLoadTrace.putAttribute('fields', 'id,name');
    usersLoadTrace.putAttribute('per_page', '100');
    usersLoadTrace.putAttribute('platform', Capacitor.getPlatform());

    usersLoadTrace.start();
    const res = await wpapi.get('wp/v2/users', {
      headers: authHeaders({}),
      searchParams: {
        per_page: 100,
        _fields: 'id,name',
      },
      hooks: {
        beforeRequest: [
          (req) => {
            logger.trace('users', 'request', new Object(req));
          },
        ],
      },
    });

    const total_pages = Number.parseInt(
      res.headers.get('X-WP-TotalPages') || '0'
    );
    usersLoadTrace.putMetric('total_pages', total_pages);
    users.value.push(...(await res.json<WPUser[]>()));

    for (let page = 1; page <= total_pages; page++) {
      const res = await wpapi.get(
        `wp/v2/users?context=edit&per_page=100&page=${page}&_fields=id,name`,
        {
          headers: authHeaders({}),
        }
      );
      apiResponses.push(res);
      console.log('[UPDATE USERS] Fetched page ' + page, res);
      users.value.push(...(await res.json<WPUser[]>()));
    }
    usersLoadTrace.stop();

    usersLoadTrace.putMetric('total_users', users.value.length);

    console.info('[UPDATE USERS] users', users);

    apiResponses.push(res);
  } catch (error) {
    apiResponses.push((error as HTTPError).response.json());
    alertController.create({
      message: JSON.stringify(
        (error as HTTPError).response.json(),
        undefined,
        2
      ),
    });
  }

  loading.value = false;
  setListableUsers(users.value as WPUser[]);
});
</script>

<style>
.id-item::part(native) {
  background-color: var(--ion-background-color);
}

.id-list {
  background-color: var(--ion-background-color);
}

.scroller {
  height: 100%;
}
</style>
