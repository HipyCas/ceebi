<template>
  <aside
    class="fixed left-0 top-0 z-10 h-screen flex-shrink-0 flex flex-col justify-start items-stretch bg-white dark:bg-zinc-950 transition-[width] delay-75 ease-in-out duration-[400ms] shadow-lg"
    :class="collapsed ? 'w-16' : 'w-48'"
  >
    <div class="py-5 px-2 flex flex-row justify-center max-h-28 aspect-square">
      <img :src="logo" />
    </div>
    <nav class="relative overflow-x-hidden">
      <div
        class="nav-bar"
        :style="{ top: `calc(${pageIndex} * (2.5rem +  0.375rem))` }"
      ></div>
      <ul class="links px-3">
        <li
          @click="$router.push('/dev/dashboard')"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Dashboard' : undefined"
        >
          <IconLayout2 class="nav-icon"></IconLayout2>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Dashboard
          </p>
        </li>
        <li
          @click="$router.push('/dev/organizations')"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Organizations' : undefined"
        >
          <IconBoxModel2 class="nav-icon"></IconBoxModel2>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Organizations
          </p>
        </li>
        <li
          @click="$router.push('/dev/users')"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Users' : undefined"
        >
          <IconUsersGroup class="nav-icon"></IconUsersGroup>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Users
            <!-- TODO Instead of this, i should play with transparency for the collapsing so it animates well -->
          </p>
        </li>
        <li
          @click="$router.push('/dev/apps')"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Apps' : undefined"
        >
          <IconPackage class="nav-icon"></IconPackage>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Apps
          </p>
        </li>
        <li @click="$router.push('/dev/security')" class="nav-item mb-1.5">
          <IconShield
            class="nav-icon"
            v-tooltip.right="collapsed ? 'Security' : undefined"
          ></IconShield>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Security
          </p>
        </li>
        <li
          @click="$router.push('/dev/reports')"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Reports' : undefined"
        >
          <IconBug class="nav-icon"></IconBug>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Reports
          </p>
        </li>
      </ul>
    </nav>
    <div class="absolute w-full bottom-14 h-14 p-1.5">
      <button
        class="h-full button-icon__wrapper flex flex-row items-center justify-center"
      >
        <IconLogout2 class="button-icon"></IconLogout2>
        <span
          class="text-white mr-4"
          :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >Logout</span
        >
      </button>
    </div>
    <div class="absolute w-full bottom-0 h-14 p-1.5">
      <button
        @click="collapsed = !collapsed"
        class="h-full w-full button-icon__wrapper"
      >
        <IconChevronsRight
          class="button-icon transition-transform"
          :class="collapsed ? 'rotate-0' : 'rotate-180'"
        ></IconChevronsRight>
      </button>
    </div>
  </aside>
  <main class="ml-16 bg-zinc-900 min-h-screen text-white p-4">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import {
  IconChevronsRight,
  IconLayout2,
  IconBoxModel2,
  IconUsersGroup,
  IconPackage,
  IconShield,
  IconBug,
  IconLogout2,
} from '@tabler/icons-vue';
import logo from '../public/favicon.png';

const collapsed = ref(true);

const route = useRoute();
const switchPath = () => {
  console.info(route.path);
  switch (route.path.split('/')[2]) {
    case 'dashboard':
      return 0;
    case 'organizations':
      return 1;
    case 'users':
      return 2;
    case 'apps':
      return 3;
    case 'security':
      return 4;
    case 'reports':
      return 5;
  }
};
const pageIndex = ref(switchPath());

watch(
  () => route.fullPath,
  (path) => (pageIndex.value = switchPath())
);
</script>

<style scoped>
.nav-bar {
  @apply absolute left-0 transition-[top] bg-cblue-500 w-2 rounded-r-md h-10;
}

.nav-item {
  @apply h-10 flex flex-row flex-nowrap items-center transition-colors px-2 py-1 hover:bg-cblue-200 rounded-lg dark:text-gray-50 dark:hover:bg-cblue-500 dark:hover:bg-opacity-80;
}

.nav-icon {
  @apply inline flex-shrink-0;
}

.nav-text {
  @apply flex-shrink-0 flex-grow-0 transition-all inline delay-200 text-lg;
}
</style>
