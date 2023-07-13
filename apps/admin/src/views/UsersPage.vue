<template>
  <PageWrapper>
    <FullpageNoPermission
      v-if="!me?.supabase.allow_users"
      permission="visualizar o editar usuarios"
    ></FullpageNoPermission>
    <UserVirtualList
      v-else
      :user-route="({ id, name }) => `/p/users/${id}/${name}`"
    >
    </UserVirtualList>
  </PageWrapper>
</template>

<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
// TODO Alert if some users are out of sync with a banner on top
import PageWrapper from '../components/PageWrapper.vue';
import { getUser } from '../user';
import FullpageNoPermission from '../components/FullpageNoPermission.vue';
import UserVirtualList from '../components/UserVirtualList.vue';

const me = getUser();
</script>
