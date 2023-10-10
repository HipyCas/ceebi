<template>
  <div
    class="bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 grid place-items-center h-screen w-screen"
  >
    <main
      class="rounded-lg bg-zinc-50 dark:bg-zinc-950 p-10 pr-14 shadow-xl w-11/12 md:w-6/12 lg:w-4/12"
    >
      <ul
        id="progress-parent"
        class="relative mb-8 mt-4 bg-zinc-400 h-1 rounded-full before:absolute before:bg-cblue-500 before:h-1 before:rounded-full before:transition-[width] before:duration-300 before:ease-in"
      >
        <li
          class="rounded-full h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 0 ? 'bg-cblue-500' : 'bg-zinc-400'"
        >
          <IconCode />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 1 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(33.33% - 1.25rem); /* 50% - (w-10 / 2) */"
        >
          <IconInfoCircle />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 2 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(66.66% - 1.25rem); /* 50% - (w-10 / 2) */"
        >
          <IconEdit />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 3 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(100% - 1.25rem); /* 50% - (w-10 / 2) */"
        >
          <IconConfetti />
        </li>
      </ul>

      <section v-if="step === 0">
        <h2 class="text-3xl font-black tracking-wide">Crea un proyecto</h2>
        <p class="pb-4">
          Para crear un proyecto dentro de tu organización, introduce el token
          entregado por el desarrollador
        </p>

        <FormKit
          type="form"
          #default="{ disabled }"
          :actions="false"
          @submit="handleTokenStart"
        >
          <FormKit
            type="select"
            name="organizationID"
            label="Organización"
            help="Selecciona la organización bajo la que crear el proyecto"
            :options="orgOptions"
            validation="required"
          ></FormKit>
          <FormKit
            type="text"
            name="token"
            label="Token de proyecto"
            placeholder="9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
            validation="required"
            v-maska
            data-maska="EEEEEEEE-EEEE-nEEE-mEEE-EEEEEEEEEEEE"
            data-maska-tokens="E:[0-9a-f]|n:[1-5]|m:[89ab]"
            data-maska-eager
          ></FormKit>
          <FormKit
            input-class="inline-block"
            wrapper-class="inline-block"
            outer-class="inline-block"
            type="submit"
            label="Empezar"
            :disabled="disabled"
          ></FormKit>
          <NuxtLink
            to="/admin/home"
            class="button !inline-block text !py-2 ml-4"
          >
            <IconArrowLeft class="inline mb-1" /> Volver
          </NuxtLink>
        </FormKit>
      </section>

      <section v-else-if="step === 1">
        <h2 class="text-3xl font-black tracking-wide">Sobre tu proyecto</h2>
        <p class="pb-4">
          El proyecto se creará con esta información y servicios base. Si crees
          que algo está mal, contacta con nosotros.
        </p>

        <h3 class="text-xl font-bold tracking-wide">
          <IconCalendar class="inline mb-1 mr-1" />Rango de fechas
        </h3>
        <p>
          Desde como pronto
          {{ projectToken?.limit_start_date }} hasta como tarde
          {{ projectToken?.limit_end_date }}
        </p>

        <h3 class="text-xl font-bold tracking-wide mt-2">
          <IconPackage class="inline mb-1 mr-1" />Aplicaciones disponibles
        </h3>
        <div class="flex gap-4 flex-wrap mt-1">
          <p
            v-for="app in projectToken?.enabled_apps"
            class="card flex-grow !bg-zinc-900 shadow-lg text-lg"
          >
            <img
              src="/apps/icons/client.png"
              class="h-10 aspect-square rounded-md inline mr-2"
            />
            {{ app.name }}
          </p>
        </div>

        <button class="button primary !py-2 mt-4" @click="step++">
          Continuar
        </button>
        <button class="button text !py-2 ml-4" @click="step--">
          <IconArrowLeft class="inline mb-1" /> Volver
        </button>
      </section>

      <section v-else-if="step === 2">
        <h2 class="text-3xl font-black tracking-wide">Datos básicos</h2>
        <p class="pb-4">
          Rellena los siguientes datos básicos sobre tu proyecto para poder
          crearlo en el sistema
        </p>

        <FormKit
          type="form"
          submit-label="Crear proyecto"
          @submit="handleCreateProyect"
        >
          <FormKit
            type="text"
            name="name"
            label="Nombre del proyecto"
            help="Un nombre interno para referirse al proyecto"
            validation="required"
          >
          </FormKit>
          <FormKit
            type="datetime-local"
            name="end"
            label="Fin del proyecto"
            help="La fecha y hora a la que clausura el proyecto/evento"
            :validation="endDateValidation"
          ></FormKit>
        </FormKit>
      </section>

      <section v-else-if="step === 3">
        <h2 class="text-3xl font-black tracking-wide mb-1">¡Proyecto listo!</h2>
        <p class="pb-4">
          Tu proyecto ha sido creado con éxito y ya puedes continuar con su
          configuración para empezar a usarlo en tu evento
        </p>

        <p class="text-sm text-slate-300 mb-1">
          Este código identifica tu proyecto dentro de la plataforma:
        </p>
        <div class="flex flex-row card !bg-zinc-900">
          <p class="flex-grow">{{ createdProjectID }}</p>
          <IconCopy
            @click="
              clipboardSupported ? copy(createdProjectID ?? 'unknown') : {}
            "
          />
        </div>

        <NuxtLink
          class="inline-block button primary mt-6 !py-2"
          :to="`/admin/${createdProjectID}/settings`"
        >
          Terminar de configurar <IconArrowRight class="inline mb-1 h-6" />
        </NuxtLink>
      </section>

      <section v-else>
        <p>Oh oh that was an error, you shouldn't be here</p>
        <button class="button primary mt-4" @click="step = 0">
          Back to start
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { validate } from 'uuid';
import {
  IconCode,
  IconInfoCircle,
  IconEdit,
  IconConfetti,
  IconCalendar,
  IconPackage,
  IconArrowLeft,
  IconCopy,
  IconArrowRight,
} from '@tabler/icons-vue';
import type { ProjectToken } from '@prisma/source/schemas';
import { sift } from 'radash';
import { useClipboard, usePermission } from '@vueuse/core';
// [0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}

const { $trpc } = useNuxtApp();
const user = useAuthenticatedUser();

usePermission('clipboard-write');
const { copy, isSupported: clipboardSupported } = useClipboard();

const createdProjectID = ref(null as string | null);

//* Progress steps
const TOTAL_STEPS = 4;
const step = ref(0);
const progress = computed(() =>
  Math.min((100 / (TOTAL_STEPS - 1)) * step.value, 100)
);
const progressCSS = computed(() => progress.value.toString() + '%');

const projectToken = ref(
  null as
    | (ProjectToken & { enabled_apps: { name: string; id: string }[] })
    | null
);

const orgOptions = await (async () => {
  let obj: Record<string, string> = {};
  (
    await $trpc.listOrganizations.query({
      where: {
        users: {
          some: { email: user.value.email },
        },
      },
    })
  ).forEach((org) => (obj[org.id] = `${org.full_name} (${org.initials})`));
  return obj;
})();

// setInterval(() => (step.value += 1), 800);
const handleTokenStart = async (fields: {
  token: string;
  organizationID: string;
}) => {
  const valid = validate(fields.token);
  if (!valid) {
    return alert('That is not a valid token');
  }
  try {
    //@ts-ignore doing weird stuff with dates
    const res = await $trpc.getAndVerifyToken.query({
      token: fields.token,
      organizationID: fields.organizationID,
    });
    console.info('res', res);
    projectToken.value = res;
    step.value += 1;
  } catch (e) {
    alert('Error: ' + (e as { message: string }).message);
  }
};

const endDateValidation = computed(() =>
  sift([
    ['required'],
    projectToken.value?.limit_start_date
      ? ['date_after', projectToken.value.limit_start_date]
      : null,
    projectToken.value?.limit_end_date
      ? ['date_before', projectToken.value.limit_end_date]
      : null,
  ])
);

const handleCreateProyect = async (fields: { name: string; end: Date }) => {
  console.info(fields);
  if (!projectToken.value) {
    alert('No token');
    return;
  }
  const { projectID } = await $trpc.createProject.mutate({
    token: projectToken.value?.id,
    organizationID: projectToken.value?.organizationId,
    projectInfo: fields,
  });
  createdProjectID.value = projectID;
  step.value += 1;
}; // Also create AppProject
// TODO Add canvas-confetti to last stage
</script>

<style scoped>
#progress-parent::before {
  width: v-bind(progressCSS);
}
</style>
