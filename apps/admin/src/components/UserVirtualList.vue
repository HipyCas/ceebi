<template>
  <IonSearchbar
    class="ion-padding-top z-20"
    enterkeyhint="search"
    placeholder="Buscar usuarios"
    :search-icon="personOutline"
    showClearButton="always"
    v-model="searchQuery"
    :disabled="isLoading"
  ></IonSearchbar>
  <PlainLoading
    v-if="isLoading"
    text="Cargando Usuarios"
    :spinner-tailwind-size="10"
  ></PlainLoading>
  <IonList>
    <RecycleScroller
      v-if="!isLoading"
      :items="filteredUsers"
      :item-size="47"
      :key-field="'id'"
      class="scroller"
      v-slot="{ item: user }"
    >
      <ion-item
        :router-link="userRoute(user)"
        router-direction="forward"
        button
        detail
        class="id-item h-47"
        lines="full"
      >
        <ion-text>{{ user.name }}</ion-text>
      </ion-item>
    </RecycleScroller>
  </IonList>
</template>

<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { RecycleScroller } from 'vue-virtual-scroller';
import { useAsyncState } from '@vueuse/core';
import {
  // HACK Not importing IonItem makes the virtual scroll work, importing it breaks it
  alertController,
  IonSearchbar,
  IonItem,
} from '@ionic/vue';
import { performance } from '../firebase';
import { trace } from 'firebase/performance';
import { wpapi } from '../req';
import { authHeaders } from '../wpauth';
import type { HTTPError } from 'ky';
import { personOutline } from 'ionicons/icons';
import { PlainLoading } from '@code/ceebi-ui';
import { logCatchError } from '@code/capacitor-utils';

defineProps<{
  userRoute: (user: {
    id: number;
    name: string;
    acf: { id_base_de_datos_app: string };
  }) => string;
}>();

const logger = useLogger();

const loadUsers = async () => {
  try {
    const users: WPUser[] = [];

    const usersLoadTrace = trace(performance, 'loadAllUsersWP');
    usersLoadTrace.putAttribute('fields', 'id,name');
    usersLoadTrace.putAttribute('per_page', '100');
    usersLoadTrace.putAttribute('platform', Capacitor.getPlatform());

    usersLoadTrace.start();
    const res = await wpapi.get('wp/v2/users', {
      headers: authHeaders({}),
      searchParams: {
        context: 'edit',
        per_page: 100,
        _fields: 'id,name,acf.id_base_de_datos_app',
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
    users.push(...(await res.json<WPUser[]>()));

    for (let page = 1; page <= total_pages; page++) {
      const res = await wpapi.get(`wp/v2/users`, {
        headers: authHeaders({}),
        searchParams: {
          context: 'edit',
          per_page: 100,
          _fields: 'id,name,acf.id_base_de_datos_app',
          page,
        },
      });
      console.log('[UPDATE USERS] Fetched page ' + page, res);
      users.push(...(await res.json<WPUser[]>()));
    }

    usersLoadTrace.putMetric('total_users', users.length);
    usersLoadTrace.stop();

    console.log('gotUsers', users);
    return users;
  } catch (error) {
    alertController.create({
      message: JSON.stringify(
        (error as HTTPError).response.json(),
        undefined,
        2
      ),
    });
    logCatchError(
      logger,
      'userVirtualList:loadUsers',
      'error when fetching users',
      error
    );
  }
};

const { state: users, isLoading } = useAsyncState(loadUsers, []);

const searchQuery = ref('');
const filteredUsers = computed(() =>
  users.value?.filter(
    (user: { name: string; email: string } | undefined) =>
      user?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

console.log('filteredUsers', filteredUsers);
watch(filteredUsers, (val) => console.info('upadted filtered', val));
</script>

<style scoped>
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
