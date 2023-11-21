<template>
  <PageWrapper>
    <IonSearchbar
      class="ion-padding-top"
      enterkeyhint="search"
      placeholder="Search users"
      :search-icon="person"
      showClearButton="always"
      v-model="searchQuery"
    ></IonSearchbar>
    <ion-list class="id-list">
      <ion-item
        v-for="user in filteredUsers"
        :key="user.id"
        button
        detail
        class="id-item"
        :router-link="`/p/users/${user.id}`"
        router-direction="forward"
      >
        <ion-text>{{ user.name }}</ion-text>
      </ion-item>
    </ion-list>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { person } from 'ionicons/icons';

import { IonSearchbar, IonList, IonItem, IonText } from '@ionic/vue';

import PageWrapper from '@/components/PageWrapper.vue';

const searchQuery = ref('');

const users = [
  {
    id: 1,
    name: 'Danae Molina',
  },
  {
    id: 2,
    name: 'Asier Lizama',
  },
  {
    id: 3,
    name: 'Miriam Gámiz',
  },
  {
    id: 4,
    name: 'Adrián Serrano',
  },
];

const filteredUsers = computed(() => {
  console.log(
    users.filter(({ name }) => name.toLowerCase().includes(searchQuery.value)),
  );
  return users.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.value),
  );
});
</script>

<style>
.id-item::part(native) {
  background-color: var(--ion-background-color);
}

.id-list {
  background-color: var(--ion-background-color);
}
</style>
