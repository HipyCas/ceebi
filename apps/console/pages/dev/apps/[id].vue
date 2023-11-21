<template>
  <header class="header rounded flex justify-between flex-wrap gap-4">
    <h1 class="header-title text-white capitalize h-10">
      <img
        :src="`/apps/icons/${app?.id}.png`"
        class="rounded h-full inline mr-3"
      />
      <span class="inline align-bottom">{{ app?.name }}</span>
    </h1>
    <NuxtLink :to="`/version?id=${app?.id}`">
      <button class="button primary h-full !py-2">
        <IconScriptPlus class="inline mb-0.5 mr-1" /> Nueva versión
      </button>
    </NuxtLink>
  </header>

  <nav class="flex flex-row gap-4 justify-start">
    <NuxtLink
      v-for="org in organizations"
      :to="orgHash(org.initials)"
      class="h-14 flex flex-row flex-nowrap items-center transition-colors px-2 py-1 hover:bg-cblue-200 rounded-lg dark:text-gray-50 dark:hover:bg-cblue-500 dark:hover:bg-opacity-80"
      :class="
        route.hash === orgHash(org.initials)
          ? 'bg-cblue-200 dark:bg-cblue-500 dark:bg-opacity-80'
          : ''
      "
    >
      <img src="/favicon.png" class="inline flex-shrink-0 h-full p-2 mr-0.5" />
      <p
        class="flex-shrink-0 flex-grow-0 transition-all inline delay-200 text-xl font-semibold tracking-wide pr-2"
      >
        {{ org.initials }}
      </p>
    </NuxtLink>
    <NuxtLink
      to="#enem"
      class="h-14 flex flex-row flex-nowrap items-center transition-colors px-2 py-1 hover:bg-cblue-200 rounded-lg dark:text-gray-50 dark:hover:bg-cblue-500 dark:hover:bg-opacity-80"
      :class="
        route.hash.trim() === '#enem'
          ? 'bg-cblue-200 dark:bg-cblue-500 dark:bg-opacity-80'
          : ''
      "
    >
      <img src="/favicon.png" class="inline flex-shrink-0 h-full p-2 mr-0.5" />
      <p
        class="flex-shrink-0 flex-grow-0 transition-all inline delay-200 text-xl font-semibold tracking-wide pr-2"
      >
        ENEM
      </p>
    </NuxtLink>
  </nav>

  <main class="mt-4">
    <section
      v-for="project in showingOrg?.projects"
      class="card mb-4 last:mb-0"
      v-auto-animate
    >
      <div
        class="flex justify-between items-center"
        @click="project.isCardOpen = !project.isCardOpen"
      >
        <h2 class="text-2xl font-semibold">
          <img src="/favicon.png" class="inline h-12 mr-2" />
          {{ project.name }}
          <IconLock
            v-if="project.appProject?.frozen"
            class="inline mb-1 stroke-2"
            v-tooltip="'Proyecto congelado'"
          />
        </h2>
        <IconChevronDown
          class="transition-transform duration-300"
          :class="project.isCardOpen ? 'rotate-180' : ''"
        />
      </div>
      <ul v-if="project.isCardOpen" class="pt-4">
        <!-- To see version notes, open a bottom sheet or a modal, maybe support them being markdown -->
        <li
          v-for="version in [...(project.appProject?.versions ?? [])]"
          class="flex flex-wrap justify-between border-b-[1px] border-opacity-80 border-cblue-800 mx-2 py-3"
        >
          <h3 class="text-xl">
            {{ version.code }}
            <span class="text-zinc-400">{{
              new Date(version.date).toDateString()
            }}</span>
          </h3>
          <!-- TODO Version date following code, maybe greyed out -->
          <div>
            <button
              class="button text mr-4 mt-2 sm:mt-0"
              @click="showReleaseNotes(version)"
            >
              <IconNews class="inline mb-1 mr-1" /> Release notes
            </button>
            <a
              class="inline-block button primary mt-2 sm:mt-0"
              :href="`/apps/versions/${project.appProject?.id}/${version.code}.apk`"
              download=""
            >
              <IconDownload class="inline mb-1 mr-1" /> Download APK
            </a>
          </div>
        </li>
      </ul>
    </section>
  </main>

  <Transition name="modal">
    <div class="modal-wrapper" v-if="isReleaseNotesModalOpen">
      <div
        class="modal-content max-h-[80vh] overflow-auto !relative !pt-0"
        v-on-click-outside="closeModal"
      >
        <strong class="block pb-2 text-xl sticky top-0 bg-cblue-800 w-full pt-4"
          >{{ selectedReleaseNotes.version }} Release Notes</strong
        >
        <div
          v-html="selectedReleaseNotesHTML"
          class="prose prose-zinc dark:prose-invert prose-li:text-zinc-50 prose-h1:hidden prose-h2:hidden"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  IconScriptPlus,
  IconChevronDown,
  IconLock,
  IconNews,
  IconDownload,
} from '@tabler/icons-vue';
import { unique } from 'radash';
import { z } from 'zod';
import { vAutoAnimate } from '@formkit/auto-animate';
import { vOnClickOutside } from '@vueuse/components';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { AppVersion } from '@prisma/client';

definePageMeta({
  // validate: (route) => /^\w+$/.test(route.params.name as string),
  validate: (route) => z.string().cuid().safeParse(route.params.id).success,
});

const { $trpc } = useNuxtApp();
const route = useRoute();

const app = await $trpc.getApp.query({ id: route.params.id as string });

const organizations = ref(
  (() =>
    unique(
      app?.appProjects.map((ap) => ap.project.organization) ?? [],
      (org) => org.id,
    ).map((org) => ({
      ...org,
      appProjects: app?.appProjects.filter(
        (ap) => ap.project.organization.id === org.id,
      ),
      projects: unique(
        app?.appProjects
          .filter((ap) => ap.project.organization.id === org.id)
          .map((ap) => ({ ...ap.project, isCardOpen: false })) ?? [],
        (proj) => proj.id,
      ).map((prj) => ({
        ...prj,
        appProject: app?.appProjects.find(
          (ap) =>
            ap.project.organization.id === org.id && ap.projectId === prj.id,
        ),
      })),
    })))(),
);

const orgHash = computed(
  () => (initials: string) => `#${initials.toLowerCase()}`,
);

const showingOrg = computed(() =>
  organizations.value.find(
    (org) => '#' + org.initials.toLowerCase() === route.hash,
  ),
);

console.log(route.hash);
// if (organizations.value.length && route.hash === '')
//   navigateTo(route.fullPath + orgHash.value(organizations.value[0].initials), {
//     replace: true,
//   });

const isReleaseNotesModalOpen = ref(false);
const selectedReleaseNotes = shallowRef({
  version: 'v2.0.1',
  content: `### Changed

- Updated from where certificates are downloaded

### Fixed

- The app now considers if microcourses that last 2 days when showing the list of available certificates`,
});
const selectedReleaseNotesHTML = computed(() =>
  DOMPurify.sanitize(marked.parse(selectedReleaseNotes.value.content)),
);

const showReleaseNotes = async (version: AppVersion) => {
  selectedReleaseNotes.value = {
    content: await $fetch(`/apps/notes/${app?.id}/${version.code}.md`),
    version: version.code,
  };
  isReleaseNotesModalOpen.value = true;
};

const closeModal = () =>
  setTimeout((isReleaseNotesModalOpen.value = false), 200);
</script>
