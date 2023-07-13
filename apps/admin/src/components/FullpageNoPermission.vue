<template>
  <main class="h-full w-full flex flex-col items-center justify-center gap-2">
    <img class="w-6/12" :src="accessDeniedIllustration" alt="" v-once />
    <p class="w-8/12 text-center" v-once>
      No dispones de permiso para {{ permission }}
    </p>
  </main>
</template>

<script setup lang="ts">
import accessDeniedIllustration from '../assets/undraw_access_denied_re_awnf.svg';

defineProps<{
  permission: string;
}>();
</script>
