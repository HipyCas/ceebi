<template>
  <aside
    class="fixed left-0 top-0 z-10 h-screen flex-shrink-0 flex flex-col justify-start items-stretch bg-cblue-950 transition-[width] delay-75 ease-in-out duration-[400ms] shadow-lg"
    :class="collapsed ? 'w-16' : 'w-48'"
  >
    <div
      class="pt-5 pb-2 px-2 flex flex-row justify-center max-h-28 aspect-square"
    >
      <img src="/favicon.png" />
    </div>
    <strong
      class="text-white transition-all delay-75 text-center mb-3 text-lg"
      :class="collapsed ? 'opacity-0 max-h-0' : 'max-h-36'"
      ref="projectName"
      >{{ project?.name }}</strong
    >
    <nav class="relative overflow-x-hidden">
      <div
        class="nav-bar"
        :style="{
          top: `calc(${pageIndex} * (2.5rem +  0.375rem) + 3.625rem)`,
        }"
      ></div>
      <NuxtLink
        to="/admin/home"
        class="nav-item mx-3"
        v-tooltip.right="collapsed ? 'Inicio' : undefined"
      >
        <IconGridDots class="nav-icon"></IconGridDots>
        <span
          class="nav-text"
          :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >Inicio</span
        >
      </NuxtLink>
      <div
        class="h-0.5 my-2 rounded-full bg-gray-300 _w-[86%] _mx-[7%] mx-3"
      ></div>
      <ul class="links px-3">
        <li
          @click="$router.push(`/admin/${route.params.project}/dashboard`)"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Tablero' : undefined"
        >
          <IconLayout2 class="nav-icon"></IconLayout2>
          <span
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Tablero
          </span>
        </li>
        <li
          @click="$router.push(`/admin/${route.params.project}/users`)"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Usuarios' : undefined"
        >
          <IconUsersGroup class="nav-icon"></IconUsersGroup>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Usuarios
            <!-- TODO Instead of this, i should play with transparency for the collapsing so it animates well -->
          </p>
        </li>
        <li
          @click="$router.push(`/admin/${route.params.project}/apps`)"
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
        <li
          @click="$router.push(`/admin/${route.params.project}/attendance`)"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Asistencia' : undefined"
        >
          <IconScan class="nav-icon"></IconScan>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Asistencia
          </p>
        </li>
        <li
          @click="$router.push(`/admin/${route.params.project}/certificates`)"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Certificados' : undefined"
        >
          <IconCertificate class="nav-icon"></IconCertificate>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Certificados
          </p>
        </li>
        <li
          @click="$router.push(`/admin/${route.params.project}/settings`)"
          class="nav-item mb-1.5"
          v-tooltip.right="collapsed ? 'Configuración' : undefined"
        >
          <IconSettings2 class="nav-icon"></IconSettings2>
          <p
            class="nav-text"
            :class="collapsed ? 'opacity-0 pl-0' : 'opacity-100 pl-2'"
          >
            Configuración
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
        class="h-full w-full button-icon__wrapper !dark:hover:bg-cblue-200"
      >
        <IconChevronsRight
          class="button-icon transition-transform"
          :class="collapsed ? 'rotate-0' : 'rotate-180'"
        ></IconChevronsRight>
      </button>
    </div>
  </aside>
  <main
    class="ml-16 bg-zinc-50 dark:bg-zinc-900 min-h-screen dark:text-zinc-50 text-zinc-950 p-4"
  >
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import {
  IconChevronsRight,
  IconLayout2,
  IconUsersGroup,
  IconPackage,
  IconLogout2,
  IconGridDots,
  IconCertificate,
  IconScan,
  IconSettings2,
} from '@tabler/icons-vue';
import type { Project } from '@prisma/source/schemas';

const route = useRoute();

const project = useState<Project>('project');

const collapsed = ref(true);

const switchPath = () => {
  console.info(route.path, route.path.split('/')[3]);
  switch (route.path.split('/')[3]) {
    case 'dashboard':
      return 0;
    case 'users':
      return 1;
    case 'apps':
      return 2;
    case 'attendance':
      return 3;
    case 'certificates':
      return 4;
    case 'settings':
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
  @apply h-10 flex flex-row flex-nowrap items-center transition-colors px-2 py-1 rounded-lg text-gray-50 hover:bg-cblue-500 hover:bg-opacity-80;
}

.nav-icon {
  @apply inline flex-shrink-0 focus:outline-none;
}

.nav-text {
  @apply flex-shrink-0 flex-grow-0 transition-all inline delay-200 text-lg;
}
</style>
