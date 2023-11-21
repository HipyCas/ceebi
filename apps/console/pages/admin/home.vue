<template>
  <main
    class="p-5 min-h-screen text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50"
  >
    <div class="flex justify-between">
      <h1 class="md:text-3xl text-2xl font-bold tracking-wide">
        Bienvenido {{ user.email }}
      </h1>
      <button
        class="bg-opacity-60 py-2 px-3 rounded hover:bg-cyellow-900 active:scale-95 transition-[transform,background-color]"
        @click="logout"
      >
        <IconLogout2 class="inline"></IconLogout2> Cerrar sesión
      </button>
    </div>
    <h2 class="text-xl mb-2 mt-3">Proyectos</h2>
    <div
      class="mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch"
    >
      <NuxtLink
        v-wave
        v-for="project in projects"
        :to="`/admin/${project.id}`"
        class="p-0"
      >
        <div class="card">
          <h3 class="mb-2 text-2xl tracking-normal">
            <img
              :_src="project.img"
              src="/favicon.png"
              alt=""
              srcset=""
              class="inline h-9 mr-1"
            />
            {{ project.name }}
          </h3>

          <p class="text-zinc-400 mb-2">Hasta el {{ project.end }}</p>
          <span
            v-tooltip="projectStatusTooltip(project.status)"
            class="text-sm w-fit px-3 py-2 items-center gap-2 rounded-full text-zinc-100 bg-opacity-60 capitalize"
            :class="projectStatusBgClass(project.status)"
            >{{ projectStatusName(project.status) }}</span
          >
        </div>
      </NuxtLink>
      <NuxtLink
        v-wave="{
          finalOpacity: 0,
        }"
        to="/admin/create"
        class="p-0"
      >
        <div class="card h-full">
          <IconPlus class="stroke-2 h-10 w-10" />
          <h3 class="mb-2 ml-1 text-2xl tracking-normal">Crear proyecto</h3>
        </div>
      </NuxtLink>
    </div>

    <h2 class="text-xl mb-2">Organización</h2>
    <div class="card">
      <FormKit
        type="form"
        submit-label="Guardar"
        @submit="saveOrganization"
        :value="organization"
      >
        <FormKit
          type="text"
          name="full_name"
          label="Nombre"
          help="El nombre de tu organización"
          class="!text-white"
          :value="organization?.full_name"
          validation="required"
        ></FormKit>
        <FormKit
          type="text"
          name="initials"
          label="Siglas"
          help="Las siglas únicas que representan tu organización"
          validation="required"
          :value="organization?.initials"
        ></FormKit>
        <FormKit
          type="email"
          name="public_email"
          label="Correo de contacto público"
          help="Un correo electrónico de contacto general para que los asistentes puedan contactar"
          class="!text-white"
          validation="required|email"
          prefix-icon="mail"
          :value="organization?.public_email"
        ></FormKit>
        <FormKit
          type="email"
          name="contact_email"
          label="Correo de contacto para desarrollo"
          help="Un correo electrónico de contacto para la comunicación con el desarrollador de la aplicación"
          value="Asociación de Estudiantes de Biociencias"
          validation="required|email"
          :value="organization?.contact_email"
        ></FormKit>
      </FormKit>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconLogout, IconLogout2, IconPlus } from '@tabler/icons-vue';

const { $trpc } = useNuxtApp();

const user = useAuthenticatedUser();

// const projects = shallowRef([
//   {
//     img: '/favicon.png',
//     name: 'II CEEBI',
//     status: 'Conservación',
//     lastDay: '21/07/2023',
//   },
//   {
//     // img: '/aebi/projects/iii-ceebi.png',
//     img: '/favicon.png',
//     name: 'III CEEBI',
//     status: 'Activo',
//     lastDay: '20/07/2024',
//   },
// ]);

const organization = (
  await $trpc.listOrganizations.query({
    where: {
      users: {
        some: {
          email: user.value.email,
        },
      },
    },
  })
).at(0);

const projects = await $trpc.listProjects.query({
  where: {
    organization: {
      id: organization?.id,
    },
  },
});
console.log('prjs', organization);

const saveOrganization = async (fields: {
  full_name: string;
  initials: string;
  public_email: string;
  contact_email: string;
}) => {
  if (organization)
    await $trpc.updateOrganization.mutate({
      where: {
        id: organization.id,
      },
      data: fields,
    });
  else alert('No organization yet');
};

const projectStatusTooltip = computed(
  () => (status: 'active' | 'conservation' | 'suspended') =>
    status === 'active'
      ? 'El proyecto está activo y se puede modificar'
      : 'Se mantiene para permitir acceso a asistentes, pero no se puede modificar',
);

const projectStatusBgClass = computed(
  () => (status: 'active' | 'conservation' | 'suspended') =>
    status === 'active'
      ? 'bg-emerald-600'
      : status === 'conservation'
        ? 'bg-zinc-600'
        : 'bg-amber-600',
);

const projectStatusName = computed(
  () => (status: 'active' | 'conservation' | 'suspended') =>
    status === 'active'
      ? 'Activo'
      : status === 'conservation'
        ? 'Conservación'
        : 'Suspendido',
);

const logout = async () => {
  await useFetch('/api/auth/logout', {
    method: 'POST',
  });
  navigateTo('/auth/login');
};
</script>
