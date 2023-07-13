<template>
  <PageWrapper back title="Generar carpetas en bucket">
    <main class="px-5">
      <h1>Generar carpetas de microcursos en bucket</h1>
      <p class="mb-2">
        Genera las carpetas de los diferentes microcursos en el bucket de
        almacenamiento de Supabase para poder así subir y descargar los
        certificados
      </p>

      <IonAccordionGroup expand="inset">
        <IonAccordion>
          <IonItem slot="header">
            <IonLabel>
              Encontrados {{ foundMicrocursos.length }} microcursos
            </IonLabel>
          </IonItem>
          <IonList slot="content">
            <IonItem v-for="microcurso in foundMicrocursos" :key="microcurso">
              <IonText>{{ microcurso }}</IonText>
            </IonItem>
          </IonList>
        </IonAccordion>
      </IonAccordionGroup>
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../../lib/components/PageWrapper.vue';
import attendanceSchema from '../../../attendance.json';
import {
  IonAccordionGroup,
  IonAccordion,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/vue';

const supabase = useSupabase();

const microcursoRegex = /^Microcurso "([\w\sáóéíú:(),¿?.ñ¡!\-\/“”–]+)"$/m;
const foundMicrocursos = [
  ...new Set(
    attendanceSchema.flatMap((session) =>
      session.events
        .filter((ev) => microcursoRegex.test(ev))
        .map((ev) => microcursoRegex.exec(ev)?.at(1))
    )
  ),
];

onMounted(async () => {
  console.log(await supabase.storage.from('certificates').list('microcursos'));
});
</script>
