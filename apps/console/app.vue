<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <notifications group="auth" position="top" />
    <notifications group="general" position="bottom right">
      <template #body="notification">
        <div class="alert" :class="`alert-${notification.item.type}`">
          <component></component>
          <p>
            {{ notification.item.title }}
          </p>
        </div></template
      >
    </notifications>
  </div>
</template>

<script setup>
// TODO Use https://nuxt.com/modules/device to prompt the user to download the app if in mobile
</script>
