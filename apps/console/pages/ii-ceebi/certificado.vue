<template>
  <div
    v-if="!resultsFound"
    class="max-w-md w-full p-6 bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 rounded-lg shadow-md my-10"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">Introduce tus datos</h2>
    <p v-if="test" class="text-lg font-bold text-red-500 text-center mb-4">
      Esta página todavía está en construcción y no funciona correctamente
    </p>
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label
          class="block text-gray-700 dark:text-gray-400 font-bold mb-2"
          for="nif"
        >
          Documento identificativo (DNI o similar)
        </label>
        <input
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline dark:bg-gray-900 dark:text-gray-200 dark:shadow-gray-700 dark:border-gray-800"
          :class="{
            'border-red-500 shadow-outline-red focus:outline-none':
              firstSubmmited && !isSubmitting && error.busqueda === notFoundMsg,
          }"
          id="nif"
          type="text"
          v-model="nif"
          v-maska
          data-maska="Z"
          data-maska-tokens="Z:[a-z0-9A-Z]:multiple"
          placeholder="X00000000X"
          required
        />
      </div>
      <div>
        <label
          class="block text-gray-700 dark:text-gray-400 font-bold mb-2"
          for="email"
        >
          Correo electrónico
        </label>
        <input
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline dark:bg-gray-900 dark:text-gray-200 dark:shadow-gray-700 dark:border-gray-800"
          :class="{
            'border-red-500 shadow-outline-red focus:outline-none':
              firstSubmmited && !isSubmitting && error.busqueda === notFoundMsg,
          }"
          id="email"
          type="email"
          v-model="email"
          v-maska
          data-maska="Z"
          data-maska-tokens="Z:[^\s]:multiple"
          placeholder="ejemplo@correo.com"
          required
        />
      </div>
      <div>
        <button
          class="bg-cblue-500 hover:bg-cblue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500 w-full"
          type="submit"
          :disabled="isSubmitting"
        >
          <IconLoader2 class="m-auto animate-spin" v-if="isSubmitting" />
          <p v-else>Comprobar certificados disponibles</p>
        </button>
      </div>
    </form>
    <p
      v-if="firstSubmmited && !isSubmitting"
      v-html="error.busqueda ? error.busqueda : notFoundMsg"
      class="font-bold text-red-500 text-center mt-4"
    ></p>
  </div>
  <div
    v-else
    class="max-w-md w-full p-4 bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 rounded-lg shadow-md my-10"
  >
    <div class="flex items-center justify-between mb-4">
      <button
        class="rounded-full p-2 mr-4 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="goBack"
      >
        <IconArrowNarrowLeft class="w-6 h-6" />
      </button>
      <h2 class="text-2xl font-bold flex-grow text-center">
        Certificados disponibles
      </h2>
      <button
        class="rounded-full p-2 ml-4 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="reload"
      >
        <IconReload
          :class="isReloading ? 'animate-spin' : ''"
          class="w-6 h-6"
        />
      </button>
    </div>
    <p v-if="test" class="text-lg font-bold text-red-500 text-center mb-4">
      Esta página todavía está en construcción y no funciona correctamente
    </p>
    <div class="flex justify-between mb-4 border-b border-t">
      <button
        class="mx-2 text-lg font-bold focus:outline-none hover:text-cblue-500 focus:text-cblue-500"
        :class="{ 'text-cblue-500': activeTab === 'asistencia' }"
        @click="activeTab = 'asistencia'"
      >
        Asistencia
      </button>
      <button
        class="mx-2 text-lg font-bold focus:outline-none hover:text-cblue-500 focus:text-cblue-500"
        :class="{ 'text-cblue-500': activeTab === 'microcursos' }"
        @click="activeTab = 'microcursos'"
      >
        Microcursos
      </button>
      <button
        class="mx-2 text-lg font-bold focus:outline-none hover:text-cblue-500 focus:text-cblue-500"
        :class="{ 'text-cblue-500': activeTab === 'poster' }"
        @click="activeTab = 'poster'"
      >
        Poster
      </button>
    </div>
    <div v-if="activeTab === 'asistencia'">
      <p
        v-if="error.asistencia"
        v-html="error.asistencia"
        class="mb-2 font-bold text-red-500 text-center"
      ></p>
      <p class="font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
        Tu porcentaje de asistencia es del
        {{ Math.trunc(results.asistencia * 100) / 100 }}%
      </p>
      <button
        :disabled="test"
        :class="test ? '!bg-gray-500 hover:bg-current' : ''"
        @click="download('asistencia')"
        v-if="results.asistencia >= 80.0"
        class="my-4 block mx-auto bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
      >
        Descargar certificado
      </button>
      <p v-else class="font-bold text-red-500 text-center">
        No has alcanzado el porcentaje mínimo de asistencia
      </p>
    </div>
    <div v-else-if="activeTab === 'microcursos'">
      <p
        v-if="error.microcursos"
        v-html="error.microcursos"
        class="mb-2 font-bold text-red-500 text-center"
      ></p>
      <div v-if="!results.microcursos.doble && results.microcursos.micro1">
        <p class="font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
          Has asistido a 1/1 microcurso de dos días:
        </p>
        <p class="font-bold text-gray-700 dark:text-gray-300 mb-2 text-center">
          {{ results.microcursos.micro1 }}
        </p>
        <button
          :disabled="test"
          :class="test ? '!bg-gray-500 hover:bg-current' : ''"
          @click="download('microcurso', results.microcursos.micro1)"
          class="my-4 block mx-auto bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
        >
          Descargar certificado
        </button>
      </div>
      <div
        v-else-if="
          results.microcursos.doble &&
          results.microcursos.micro1 &&
          results.microcursos.micro2
        "
      >
        <div class="flex flex-col items-center justify-center">
          <p
            class="font-bold text-gray-900 dark:text-gray-100 mb-2 text-center"
          >
            Has asistido a 2/2 microcursos de un día:
          </p>
          <p
            class="font-bold text-gray-700 dark:text-gray-300 mb-2 text-center"
          >
            {{ results.microcursos.micro1 }}
          </p>
          <IconArrowNarrowDown class="text-gray-700 dark:text-gray-100" />
          <button
            :disabled="test"
            :class="test ? '!bg-gray-500 hover:bg-current' : ''"
            @click="download('microcurso', results.microcursos.micro1)"
            class="mx-2 my-4 bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
          >
            Descargar primer certificado
          </button>
          <p
            class="font-bold text-gray-700 dark:text-gray-100 mb-2 text-center"
          >
            {{ results.microcursos.micro2 }}
          </p>
          <IconArrowNarrowDown class="text-gray-700 dark:text-gray-300" />
          <button
            :disabled="test"
            :class="test ? '!bg-gray-500 hover:bg-current' : ''"
            @click="download('microcurso', results.microcursos.micro2)"
            class="mx-2 my-4 bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
          >
            Descargar segundo certificado
          </button>
        </div>
      </div>
      <div v-else-if="results.microcursos.doble && results.microcursos.micro1">
        <p class="font-bold text-gray-900 mb-2 text-center">
          Has asistido a 1/2 microcursos de un día:
        </p>
        <p class="font-bold text-gray-700 mb-2 text-center">
          {{ results.microcursos.micro1 }}
        </p>
        <button
          :disabled="test"
          :class="test ? '!bg-gray-500 hover:bg-current' : ''"
          @click="download('microcurso', results.microcursos.micro1)"
          class="my-4 block mx-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500e"
        >
          Descargar certificado
        </button>
      </div>
      <div v-else>
        <p class="font-bold text-red-500 text-center">
          No has asistido a ningún microcurso
        </p>
      </div>
    </div>
    <div v-else-if="activeTab === 'poster'">
      <p
        v-if="error.poster"
        v-html="error.poster"
        class="mb-2 font-bold text-red-500 text-center"
      ></p>
      <div v-if="results.poster">
        <p class="font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
          Has presentado algún póster
        </p>
        <button
          :disabled="test"
          :class="test ? '!bg-gray-500 hover:bg-current' : ''"
          @click="download('poster')"
          class="my-4 block mx-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-offset-2 ring-clblue-500"
        >
          Descargar certificado
        </button>
      </div>
      <p v-else="!results.poster" class="font-bold text-red-500 text-center">
        No has presentado ningún póster, si crees que se trata de un error,
        conctacta con nosotros por correo
        <a href="mailto:info@biociencias.es">info@biociencias.es</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowNarrowLeft,
  IconReload,
  IconArrowNarrowDown,
  IconLoader2,
} from '@tabler/icons-vue';
import { vMaska } from 'maska';

definePageMeta({
  layout: 'client',
});

type SearchResult = {
  id: string | null;
  asistencia: number;
  microcursos: {
    doble: boolean;
    micro1: string;
    micro2: string;
  };
  poster: boolean;
};

const notFoundMsg: string =
  'No se han encontrado resultados para el NIF y correo electrónico proporcionados. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
const results = ref<SearchResult>({
  id: null,
  asistencia: 0,
  microcursos: {
    doble: false,
    micro1: '',
    micro2: '',
  },
  poster: false,
});
const nif = ref('');
const email = ref('');
const isSubmitting = ref(false);
const isReloading = ref(false);
const resultsFound = ref(false);
const firstSubmmited = ref(false);
const test = ref(false); // True if buttons should be disabled due to testing
const error = ref({
  busqueda: '',
  asistencia: '',
  microcursos: '',
  poster: '',
});
const activeTab = ref('asistencia');

async function handleSubmit() {
  firstSubmmited.value = true;
  isSubmitting.value = true;
  error.value = {
    busqueda: '',
    asistencia: '',
    microcursos: '',
    poster: '',
  };
  try {
    const response = await fetch(
      `https://ceebi.wupp.dev/api/ceebi-ii/consulta/certificado?nif=${nif.value.trim()}&email=${email.value.trim()}`,
    );
    if (response.status === 200) {
      results.value = await response.json();
      resultsFound.value = true;
    } else if (response.status === 404) {
      results.value.id = null;
      error.value.busqueda = notFoundMsg;
    } else {
      results.value.id = null;
      error.value.busqueda =
        'Ha ocurrido un error al intentar conseguir los certificados. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
    }
  } catch (e) {
    console.log(e);
    error.value.busqueda =
      'Ha ocurrido un error al intentar conseguir los certificados. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
  } finally {
    isSubmitting.value = false;
  }
}

async function download(certType: string, micro?: string) {
  let path = certType;
  if (certType === 'microcurso' && micro) {
    const microId = micro.replace(/[áóéíú:(),¿?.ñ¡!\-\/“”– ]/g, '_');
    path += '/' + microId;
  } else if (certType === 'microcurso') {
    error.value.microcursos =
      'No se ha especificado el microcurso que descargar. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
    return;
  }

  if (activeTab.value === 'asistencia') {
    error.value.asistencia = '';
    try {
      const url = `https://ceebi.wupp.dev/api/ceebi-ii/certificado/${path}/${results.value.id}.pdf`;
      const response = await fetch(url);
      if (response.status === 200) {
        window.open(url, '_blank');
      } else if (response.status === 403) {
        error.value.asistencia =
          'No cumples los requisitos para obtener este certificado. Si crees que se trata de un error, conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
      } else {
        error.value.asistencia =
          'Ha ocurrido un error al intentar conseguir el certificado. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
      }
    } catch (e) {
      console.log(e);
      error.value.asistencia =
        'Ha ocurrido un error al intentar conseguir el certificado. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
    }
  } else if (activeTab.value === 'microcursos') {
    error.value.microcursos = '';
    try {
      const url = `https://ceebi.wupp.dev/api/ceebi-ii/certificado/${path}/${results.value.id}.pdf`;
      const response = await fetch(url);
      if (response.status === 200) {
        window.open(url, '_blank');
      } else if (response.status === 403) {
        error.value.microcursos =
          'No cumples los requisitos para obtener este certificado. Si crees que se trata de un error, conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
      } else {
        error.value.microcursos =
          'Ha ocurrido un error al intentar conseguir el certificado. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
      }
    } catch (e) {
      console.log(e);
      error.value.microcursos =
        'Ha ocurrido un error al intentar conseguir el certificado. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
    }
  } else if (activeTab.value === 'poster') {
    error.value.poster = '';
    try {
      const url = `https://ceebi.wupp.dev/api/ceebi-ii/certificado/${path}/${results.value.id}.pdf`;
      const response = await fetch(url);
      if (response.status === 200) {
        window.open(url, '_blank');
      } else if (response.status === 404) {
        error.value.poster =
          'No se ha encontrado ningún certificado de poster. Si se trata de un error, conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
      } else {
        error.value.poster =
          'Ha ocurrido un error al intentar conseguir el certificado. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
      }
    } catch (e) {
      console.log(e);
      error.value.poster =
        'Ha ocurrido un error al intentar conseguir el certificado. Conctacta con nosotros por correo <a href="mailto:info@biociencias.es">info@biociencias.es</a>';
    }
  }
}

function goBack() {
  resultsFound.value = false;
  firstSubmmited.value = false;
  results.value = {
    id: null,
    asistencia: 0,
    microcursos: {
      doble: false,
      micro1: '',
      micro2: '',
    },
    poster: false,
  };
}

async function reload() {
  isReloading.value = true;
  await handleSubmit();
  isReloading.value = false;
}
</script>
