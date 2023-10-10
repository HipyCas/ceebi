<template>
  <h1 class="text-3xl font-bold p-0">
    <NuxtLink :to="`/admin/${route.params.project}/apps`">
      <IconArrowLeft
        class="cursor-pointer inline-block mb-1 -ml-1 p-0.5 h-full stroke-[3] rounded-full hover:bg-cblue-500 hover:bg-opacity-50"
        height="36"
        width="36"
      />
    </NuxtLink>
    Aplicación: {{ appProject.app.name }}
  </h1>
  <p>{{ appProject.app.description }}</p>
  <div
    class="mt-4 flex flex-row items-center justify-start gap-3 card flex-wrap"
  >
    <img
      :src="`/apps/icons/${appProject.app.id}.png`"
      alt=""
      srcset=""
      class="h-20 rounded"
    />
    <div class="flex-grow flex-shrink-0">
      <p class="text-zinc-600 dark:text-zinc-400">Última versión</p>
      <strong class="text-2xl"
        ><IconLock
          v-if="appProject.frozen"
          class="inline mb-0.5 stroke-[3]"
          v-tooltip="'Esta es la última versión disponible para este proyecto'"
        />
        {{ versions.at(0)?.code }}</strong
      >
    </div>
    <div>
      <button
        class="bg-opacity-80 py-2 px-3 mr-3 rounded hover:bg-cblue-900 active:scale-95 transition-[transform,background-color]"
        @click="
          versions.at(0)
            ? ((versions.at(0) ?? { open: false }).open = !(
                versions.at(0) ?? { open: false }
              ).open)
            : {}
        "
      >
        <IconNews class="inline mb-1" />
        Cambios
      </button>
      <a
        class="inline-block bg-cblue-500 bg-opacity-80 py-2 px-3 rounded hover:bg-cblue-700 active:scale-95 transition-[transform,background-color]"
        :href="`/apps/versions/${appProject.id}/${versions.at(0)?.code}.apk`"
        download
      >
        <IconDownload class="inline mb-1" />
        Descargar
      </a>
    </div>
  </div>

  <section class="mt-4">
    <h2 class="text-xl font-semibold mb-2">
      <IconTags class="inline mb-1" />
      Versiones
    </h2>
    <ul>
      <li
        v-auto-animate
        v-for="version in versions"
        :key="version.id"
        class="card !bg-zinc-950 mb-2"
      >
        <h3
          class="text-lg font-semibold relative w-full"
          @click="version.open = !version.open"
        >
          {{ version.code }}
          <a
            :href="`/apps/versions/${appProject.id}/${version.code}.apk`"
            download
            @click.stop="() => {}"
          >
            <IconDownload
              class="absolute right-10 top-0 hover:bg-cblue-500 hover:bg-opacity-40 rounded-md p-1 h-[120%] w-auto -m-1 transition-all active:scale-90 active:bg-opacity-60"
            />
          </a>
          <IconChevronDown
            class="absolute right-0 top-0 transition-transform"
            :class="version.open ? 'rotate-180' : ''"
          />
        </h3>
        <p
          v-if="version.open"
          v-html="version.notesHtml"
          class="prose prose-zinc dark:prose-invert prose-sm pt-4"
        ></p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  IconArrowLeft,
  IconLock,
  IconDownload,
  IconNews,
  IconChevronDown,
  IconTags,
} from '@tabler/icons-vue';
import { vAutoAnimate } from '@formkit/auto-animate';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const { $trpc } = useNuxtApp();
const route = useRoute();

const appProject = await $trpc.getAppProject.query({
  appId: route.params.app as string,
  projectId: route.params.project as string,
});

const versions = ref(
  [] as {
    open: boolean;
    notesHtml: string;
    code: string;
    date: string;
    id: number;
    appProjectId: number;
  }[]
);

(async () => {
  versions.value = await Promise.all(
    appProject.versions.map(async (ver) => ({
      ...ver,
      open: false,
      notesHtml: DOMPurify.sanitize(
        marked.parse(
          await $fetch(`/apps/notes/${appProject.appId}/${ver.code}.md`)
        )
      ),
    }))
  );
  versions.value.reverse();
})();

watch(
  versions,
  (val) => {
    console.log('va', val);
  },
  { deep: true }
);
</script>
