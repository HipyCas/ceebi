<template>
  <page-wrapper>
    <IonSearchbar
      class="ion-padding-top"
      enterkeyhint="search"
      placeholder="Search by ID"
      :search-icon="idCard"
      showClearButton="always"
      v-model="search"
    ></IonSearchbar>
    <ion-list class="id-list">
      <ion-item
        v-for="item in filteredItems"
        :key="item.id"
        button
        detail
        @click="showAttendance(item.id)"
        class="id-item"
      >
        <ion-text>{{ item.id }}</ion-text>
      </ion-item>
    </ion-list>
  </page-wrapper>
</template>

<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonText,
  useIonRouter,
} from '@ionic/vue';
import { idCard } from 'ionicons/icons';
import { computed, ref } from 'vue';
import PageWrapper from '@/components/PageWrapper.vue';

const router = useIonRouter();

const search = ref('');

const items = [
  {
    id: '49202503Y',
  },
  {
    id: '49202998D',
  },
  {
    id: '49342312C',
  },
  {
    id: '23476584I',
  },
  {
    id: '49202503Y',
  },
  {
    id: '49202998D',
  },
  {
    id: '49342312C',
  },
  {
    id: '23476584I',
  },
];

const filteredItems = computed(() =>
  items.filter((item) => item.id.toLowerCase().includes(search.value)),
);

const showAttendance = (id: string) => {
  router.push(`/attendance/${id}`);
};
</script>

<style scoped>
.id-item::part(native) {
  background-color: var(--ion-background-color);
}

.id-list {
  background-color: var(--ion-background-color);
}
</style>
