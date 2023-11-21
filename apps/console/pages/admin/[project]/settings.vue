<template>
  <h1 class="text-3xl font-bold">Configuración</h1>
  <p>Opciones de configuración de las diferentes aplicaciones</p>

  <!--* Legacy info banner -->
  <div v-if="legacy" class="card !bg-zinc-950 border border-zinc-700 mt-4">
    <h3 class="text-lg">
      <IconInfoCircle class="inline mr-1 mb-0.5" />
      Este proyecto no es compatible
    </h3>
    <p class="text-sm mt-2 text-zinc-400">
      Este proyecto fue creado y programado previamente a la creación de esta
      consola, y por tanto estas opciones no son configurables.<br /><br />Los
      valores asignados correspondes a los manualmente registrados en la
      aplicación durantes su desarrollo.
    </p>
  </div>

  <!--* CONFIG CARDS -->
  <!--* Certificates -->
  <section class="card mt-4">
    <h2 class="text-xl mb-2">
      <IconCertificate class="inline mb-1"></IconCertificate> Certificados
    </h2>
    <FormKit
      type="form"
      submit-label="Guardar"
      @submit="saveCertificateConfig"
      :disabled="legacy"
    >
      <!-- Date after which the certificates will be allowed to download -->
      <FormKit
        name="minimumAttendance"
        type="number"
        label="Porcentaje de asistencia necesario"
        help="Porcentaje de asistencia mínimo que deberá de tener un asistente para poder descargar su certificado de asistencia"
        validation="required"
        min="0"
        max="100"
        step="0.01"
        suffix-icon="percentage"
        :value="loadedConfig.certificatesAttendancePercent"
      ></FormKit>
      <FormKit
        name="downloadDate"
        type="datetime-local"
        label="Fecha para descarga"
        help="Fecha a partir de la cual los asistentes podrán descargar los certificados"
        validation="required"
        :value="downloadDate"
      ></FormKit>
    </FormKit>
  </section>

  <!--* Authentication -->
  <section class="card mt-4">
    <h2 class="text-xl mb-2">
      <IconKey class="inline mb-1"></IconKey> Autenticación
    </h2>
    <FormKit
      type="form"
      submit-label="Guardar"
      @submit="saveAuthenticationConfig"
      :disabled="legacy"
    >
      <!-- Base wordpress URL for auth -->
      <FormKit
        type="url"
        name="baseWordpressURL"
        label="URL base de WordPress"
        help="La URL base de tu sitio de web de WordPress, usada para inicio de sesión"
        validation="required|url"
        placeholder="https://mywpsite.com"
        :value="baseWordpressURL"
      ></FormKit>
      <!-- Restricted pages to logged in users -->
      <FormKit
        type="checkbox"
        name="restrictedPages"
        label="Páginas restringidas"
        help="Páginas que requieren que el usuario haya iniciado sesión con su cuenta"
        :options="[
          'Notificaciones',
          'QR y Asistencia',
          'Noticias',
          'Horario',
          'Sobre y Patrocinadores',
        ]"
        decorator-icon="check"
        :value="restrictedPages"
      ></FormKit>
    </FormKit>
  </section>
</template>

<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { IconCertificate, IconKey, IconInfoCircle } from '@tabler/icons-vue';
import { format, formatISO, parseISO } from 'date-fns';
import type {
  AuthenticationConfig,
  CertificateConfig,
} from '~~/server/trpc/schema';

const { $trpc, vueApp } = useNuxtApp();
const route = useRoute();
const project = useState('project');

const loadedConfig = await $trpc.getProjectConfig.query({
  projectId: route.params.project as string,
});

console.log(loadedConfig.certificatesDownloadDatetime);

const downloadDate = format(
  parseISO(loadedConfig.certificatesDownloadDatetime ?? formatISO(new Date())),
  "yyyy-MM-dd'T'HH:mm",
);
console.log('downdate', downloadDate);

const saveCertificateConfig = async (fields: CertificateConfig['fields']) => {
  await $trpc.setCertificateConfig.mutate({
    projectName: route.params.project as string,
    fields,
  });
};

const { baseWordpressURL, restrictedPages } =
  await $trpc.getAuthenticationConfig.query({
    projectName: route.params.project as string,
  });

const saveAuthenticationConfig = async (
  fields: AuthenticationConfig['fields'],
) => {
  await $trpc.setAuthenticationConfig.mutate({
    projectName: route.params.project as string,
    fields,
  });
};

const legacy = computed(() => project.value?.legacy);

onMounted(() => {
  vueApp.notify({
    group: 'app',
    title: 'Test',
  });
});
// TODO Implement setting legacy in dev console
</script>
