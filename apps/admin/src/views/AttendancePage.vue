<template>
  <page-wrapper>
    <FullpageNoPermission
      v-if="!me?.supabase.allow_attendance"
      permission="visualizar o editar la asistencia"
    ></FullpageNoPermission>
    <UserVirtualList v-else :user-route="userRoute"></UserVirtualList>
  </page-wrapper>
</template>

<script lang="ts" setup>
import PageWrapper from '../components/PageWrapper.vue';
import { getUser } from '../user';
import FullpageNoPermission from '../components/FullpageNoPermission.vue';
import UserVirtualList from '../components/UserVirtualList.vue';

const me = getUser();

const userRoute = ({
  name,
  acf,
}: {
  name: string;
  acf: { id_base_de_datos_app: string };
}) => `/p/attendance/${acf.id_base_de_datos_app}/${name}`;
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
