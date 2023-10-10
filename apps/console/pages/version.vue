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
          <IconClick />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 1 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(25% - 0.5rem); /* 50% - (w-10 / 2) */"
        >
          <IconInfoCircle />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 2 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(50% - 0.75rem); /* 50% - (w-10 / 2) */"
        >
          <IconCloudUpload />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 3 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(75% - 1rem); /* 50% - (w-10 / 2) */"
        >
          <IconNews />
        </li>
        <li
          class="rounded-full h-10 w-10 absolute left-0 top-[50%] -translate-y-[50%] grid place-items-center transition-colors duration-150 delay-300"
          :class="step >= 4 ? 'bg-cblue-500' : 'bg-zinc-400'"
          style="left: calc(100% - 1.25rem); /* 50% - (w-10 / 2) */"
        >
          <IconCubeSend />
        </li>
      </ul>

      <section v-if="step === 0">
        <h2 class="text-3xl font-black tracking-wide">Selecciona una app</h2>
        <p class="pb-4">
          Para crear la nueva versión, selecciona una aplicación y proyecto para
          crear la aplicación
        </p>

        <FormKit
          type="form"
          #default="{ disabled }"
          :actions="false"
          @submit="handlePickAppProject"
        >
          <FormKit
            type="select"
            name="appId"
            label="Aplicación"
            help="Selecciona una aplicación para ver los proyectos disponibles"
            :options="{
              '': '--- Seleccionar ---',
              ...objectify(
                apps.map((app) => ({ label: app.name, value: app.id })),
                (a) => a.value,
                (a) => a.label
              ),
            }"
            v-model="appId"
            validation="required"
          ></FormKit>
          <FormKit
            type="select"
            name="appProjectId"
            label="Proyecto"
            help="Selecciona un proyecto aplicable"
            :options="[
              {
                label: '--- Seleccionar ---',
                value: '',
              },
              ...(
                apps.find((app) => app.id === appId) ?? { appProjects: [] }
              ).appProjects.map((ap) => ({
                label: `${ap.project.name} (${
                  ap.project.organization.initials
                })${ap.frozen ? ' [CONGELADO]' : ''}`,
                value: ap.id,
                attrs: { disabled: ap.frozen },
              })),
            ]"
            :disabled="appId === ''"
            validation="required"
          ></FormKit>

          <FormKit
            outer-class="inline-block"
            type="submit"
            label="Empezar"
            :disabled="disabled"
          ></FormKit>
          <NuxtLink
            to="/dev/dashboard"
            class="button !inline-block text !py-2 ml-4"
          >
            <IconArrowLeft class="inline mb-1" /> Salir
          </NuxtLink>
        </FormKit>
      </section>

      <section v-else-if="step === 1">
        <h2 class="text-3xl font-black tracking-wide">Información básica</h2>
        <p class="pb-4">
          Rellena esta información básica sobre tu nueva versión
        </p>

        <FormKit
          type="form"
          submit-label="Continuar"
          @submit="handleInfoSubmit"
        >
          <FormKit
            type="text"
            name="version"
            label="Código de versión"
            help="Código de versión compatible con SemVer"
            :validation="[
              ['required'],
              [
                'matches',
                /^v([0-9]+)\.([0-9]+)\.([0-9]+)(-(rc|alpha|beta).[0-9]+)?$/,
              ],
            ]"
            validation-visibility="live"
          ></FormKit>

          <FormKit
            type="date"
            name="date"
            label="Fecha de publicación"
            validation="required"
            validation-visibility="live"
            :value="new Date().toISOString().split('T')[0]"
          ></FormKit>
        </FormKit>
      </section>

      <section v-else-if="step === 2">
        <h2 class="text-3xl font-black tracking-wide">Sube el APK</h2>
        <p class="pb-4">
          Sube el archivo APK instalable correspondiente a la versión a
          distribuir
        </p>
        <div
          ref="dropZoneRef"
          class="border-dashed border-2 rounded-md py-12 flex flex-col justify-center items-center"
          :class="
            isOverDropZone
              ? 'outline outline-4 outline-accent'
              : fileError
              ? 'outline outline-4 outline-error'
              : ''
          "
        >
          <template v-if="uploadedFile">
            <p class="mb-3 font-bold">
              <IconBrandAndroid class="inline" /> {{ uploadedFileName }}
            </p>
            <input id="hidden-input" type="file" multiple class="hidden" />
            <button @click="() => open()" class="mt-2 button primary px-3 py-1">
              <IconFolderSearch class="inline mb-1" />
              Reemplazar
            </button>
          </template>
          <template v-else>
            <p class="mb-3 font-bold flex flex-wrap justify-center">
              Arrastra un archivo o
            </p>
            <input id="hidden-input" type="file" multiple class="hidden" />
            <button @click="() => open()" class="mt-2 button primary px-3 py-1">
              <IconFolderSearch class="inline mb-1" />
              Elegir archivo
            </button>
          </template>
        </div>
        <button
          v-if="uploadedFile"
          @click="step++"
          class="block mt-4 button primary !px-5 !py-2"
        >
          Siguiente
          <IconArrowRight class="inline mb-1" />
        </button>
      </section>

      <section v-else-if="step === 3">
        <h2 class="text-3xl font-black tracking-wide">
          Notas de actualización
        </h2>
        <p class="pb-4">
          Provee formateado con MarkDown notas de los cambios con esta
          actualización
        </p>

        <FormKit
          type="form"
          #default="{ disabled }"
          :actions="false"
          @submit="handleNotesPublish"
        >
          <!-- TODO Add help with reference to commonmark spec -->
          <FormKit
            type="textarea"
            name="notes"
            label="Notas de actualización"
            label-class="hidden"
            inner-class="max-h-[30vh] overflow-y-auto"
            validation="required"
          ></FormKit>

          <FormKit
            outer-class="inline-block"
            type="submit"
            label="Publicar"
            :disabled="disabled"
          ></FormKit>
          <button @click="step--" class="button !inline-block text !py-2 ml-4">
            <IconArrowLeft class="inline mb-1" /> Volver
          </button>
        </FormKit>
      </section>

      <section v-else-if="step === 4">
        <h2 class="text-3xl font-black tracking-wide mb-1">
          ¡Versión publicada!
        </h2>
        <p class="pb-4">
          Tu versión ha sido creada con éxito y ya está disponible para
          descargar desde la consola
        </p>

        <p class="text-sm text-slate-300 mb-1">
          Utiliza este enlace para difundir tu aplicación:
        </p>
        <div class="flex flex-row card !bg-zinc-900">
          <p class="flex-grow">
            https://ceebi.wupp.dev/apps/{{ createdVersion?.id }}
          </p>
          <IconCopy
            @click="
              clipboardSupported
                ? copy(createdVersion?.id.toString() ?? 'unknown')
                : {}
            "
          />
        </div>

        <NuxtLink
          class="inline-block button primary mt-6 !py-2"
          :to="`/dev/apps/${appId}`"
        >
          Ver <IconArrowRight class="inline mb-1 h-6" />
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
definePageMeta({
  layout: false,
  middleware: ['protected', 'dev'],
});

import { AppVersion } from '@prisma/client';
import {
  IconClick,
  IconArrowLeft,
  IconInfoCircle,
  IconCloudUpload,
  IconNews,
  IconCubeSend,
  IconFolderSearch,
  IconBrandAndroid,
  IconArrowRight,
  IconCopy,
} from '@tabler/icons-vue';
import { objectify, unique } from 'radash';
import { z } from 'zod';
import { AppVersionSchema } from '@prisma/source/schemas';
import {
  useClipboard,
  usePermission,
  useDropZone,
  useFileDialog,
} from '@vueuse/core';

const { $trpc } = useNuxtApp();
const route = useRoute();

const TOTAL_STEPS = 5;
const step = ref(0);
const progress = computed(() =>
  Math.min((100 / (TOTAL_STEPS - 1)) * step.value, 100)
);
const progressCSS = computed(() => progress.value.toString() + '%');

usePermission('clipboard-write');
const { copy, isSupported: clipboardSupported } = useClipboard();

const apps = await $trpc.getAppsWithProjects.query();

const appId = ref(route.query.id ?? '');

const _partialSchema = AppVersionSchema.merge(
  z.object({ notes: z.string(), appId: z.string().cuid() })
).partial();
let totalVersionData: z.infer<typeof _partialSchema> = {};

const uploadedFile = ref(null as string | null);
const uploadedFileName = computed(() =>
  uploadedFile ? uploadedFile.value?.split('/').at(-1) : ''
);
const fileError = ref(false);
const fileHandler = async (
  files: File[] | FileList | null,
  tooManyErrorMsg: string
) => {
  fileError.value = false;
  if (files && files.length > 0) {
    if (files.length === 1) {
      let body = new FormData();
      body.append('apk', files[0]);
      console.info('fetch');
      const res = (await $fetch('/api/v1/dev/apps/apk-upload', {
        method: 'POST',
        body,
        query: {
          appProjectId: selectedAppProject.value?.id,
          version: totalVersionData['code'],
        },
      })) as string;
      uploadedFile.value = res;
      step.value++;
    } else {
      fileError.value = true;
    }
  } else {
    fileError.value = true;
  }
};
const { open, files } = useFileDialog();
watch(files, (uploaded) =>
  fileHandler(uploaded, 'No puedes seleccionar más de un archivo')
);
const dropZoneRef = ref();
const { isOverDropZone } = useDropZone(dropZoneRef, (files) =>
  fileHandler(files, 'No puedes arrastrar más de un archivo')
);

const selectedAppProject: Ref<
  (typeof apps)[number]['appProjects'][number] | null
> = ref(null);
const handlePickAppProject = async (fields: {
  appId: string;
  appProjectId: string;
}) => {
  selectedAppProject.value =
    unique(apps.flatMap((app) => app.appProjects)).find(
      (ap) => ap.id === Number.parseInt(fields.appProjectId)
    ) ?? null;
  totalVersionData['appProjectId'] = selectedAppProject.value?.id;
  totalVersionData['appId'] = selectedAppProject.value?.appId;
  step.value++;
};

const handleInfoSubmit = async (fields: { version: string; date: string }) => {
  totalVersionData['code'] = fields.version;
  totalVersionData['date'] = new Date(fields.date);
  console.info(fields, totalVersionData);
  step.value++;
};

const createdVersion: Ref<AppVersion | null> = ref(null);
const handleNotesPublish = async (fields: { notes: string }) => {
  console.log('stuff', totalVersionData);
  totalVersionData['notes'] = fields.notes;
  const version = await $trpc.createVersion.mutate(totalVersionData); // as z.infer<typeof z.strictObject(_partialSchema)>);
  createdVersion.value = version;
  step.value++;
};
</script>

<style scoped>
#progress-parent::before {
  width: v-bind(progressCSS);
}
</style>
