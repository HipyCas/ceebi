<template>
  <page-wrapper>
    <IonSearchbar
      class="ion-padding-top z-20"
      enterkeyhint="search"
      placeholder="Buscar usuarios"
      :search-icon="idCard"
      showClearButton="always"
      v-model="search"
    ></IonSearchbar>

    <IonList _class="id-list">
      <RecycleScroller
        :items="filteredUsers"
        :item-size="51"
        :key-field="'id'"
        class="scroller"
        v-slot="{ item: user }"
      >
        <router-link
          :to="`/p/attendance/${user.id}`"
          router-direction="forward"
        >
          <ion-item button detail class="id-item" lines="full">
            <ion-text>{{ user.name }}</ion-text>
          </ion-item>
        </router-link>
      </RecycleScroller>
    </IonList>
  </page-wrapper>
</template>

<script lang="ts" setup>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { IonSearchbar, IonList, IonText } from '@ionic/vue';
import { idCard } from 'ionicons/icons';
import PageWrapper from '../components/PageWrapper.vue';
import { getListableUsers } from '../listableUsers';
import { RecycleScroller } from 'vue-virtual-scroller';

const search = ref('');

const users = getListableUsers();

const filteredUsers = computed(() =>
  users.value.filter((item) => item.name.toLowerCase().includes(search.value))
);
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
