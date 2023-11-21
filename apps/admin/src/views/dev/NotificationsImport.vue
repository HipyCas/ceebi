<template>
  <PageWrapper back title="Importar notificaciones">
    <main class="px-5">
      <h1>Importar notificaciones</h1>
      <p>
        Importa a la base de datos notificaciones del sistema antiguo
        almacenadas en JSON
      </p>
      <input
        type="file"
        accept=".json,application/json"
        class="mt-3"
        @change="processFile($event)"
      />
      <IonButton
        @click="importFile"
        expand="block"
        :disabled="!haveFile"
        class="mt-2"
        >Importar</IonButton
      >
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import { File } from 'buffer';
import PageWrapper from '../../components/PageWrapper.vue';
import { IonButton, modalController } from '@ionic/vue';
import { z } from 'zod';

const supabase = useSupabase();

const notificationsSchema = z
  .array(
    z.object({
      id: z.string({
        required_error: 'ID de la notificación requerido',
      }),
      title: z.string({
        required_error: 'Título de la notificación requerido',
      }),
      body: z.string({
        required_error: 'Cuerpo de la notificación requerido',
      }),
      schedule: z.object({
        year: z.number().optional().default(2022),
        month: z.number().gte(0).lte(12).optional().default(7),
        day: z.number().gte(0).lt(31).optional().default(0),
        hour: z.number().gte(0).lte(24).optional().default(0),
        minutes: z.number().gte(0).lt(60).optional().default(0),
        seconds: z.number().gte(0).lt(60).optional().default(0),
      }),
      icon: z.string({
        required_error: 'Icono de la notificación requerido',
      }),
      buttons: z
        .array(
          z.object({
            id: z.string({
              required_error: 'ID del botón requerido',
            }),
            text: z.string({
              required_error: 'Texto del botón requerido',
            }),
            link: z
              .string({
                required_error: 'Link del botón requerido',
              })
              .url({ message: 'El link del botón debe de ser una URL válida' }),
            icon: z.string({
              required_error: 'Icono del botón requerido',
            }),
          }),
        )
        .optional(),
    }),
  )
  .nonempty({
    message: 'Se requiere por lo menos una notificación',
  });

const haveFile = ref(false);
let file: File;

const processFile = (ev: any) => {
  file = ev.target.files[0] as File;
  haveFile.value = true;
};

const importFile = async () => {
  const contents = await file.text();
  console.log(contents);
  const parseResult = notificationsSchema.safeParse(JSON.parse(contents));
  if (parseResult.success) {
    const { data: existingNotifications } = await supabase
      .from('notifications')
      .select('shortname');
    parseResult.data.forEach(
      async ({ id, title, body, schedule, icon, buttons }) => {
        if (
          existingNotifications?.find((not) => not.shortname === id) !==
          undefined
        ) {
          useToast({
            color: 'warning',
            message: `Notificación '${id}' ya guardada`,
          });
        } else {
          const { error } = await supabase.from('notifications').insert({
            shortname: id,
            schedule: new Date(
              schedule.year,
              schedule.month - 1,
              schedule.day,
              schedule.hour,
              schedule.minutes,
              schedule.seconds,
            ),
            title,
            body,
            icon,
            buttons,
          });
          if (error)
            useToast({
              color: 'danger',
              message: 'Error al crear la notificación',
              buttons: [
                {
                  text: 'detalle',
                  handler: () =>
                    modalController
                      .create({
                        component: defineAsyncComponent(
                          () => import('../../components/JSONViewer.vue'),
                        ),
                        componentProps: {
                          data: error,
                        },
                      })
                      .then((m) => m.present()),
                },
              ],
            });
        }
      },
    );
  } else {
    useToast({
      message: 'Formato inválido',
      color: 'danger',
      buttons: [
        {
          text: 'detalle',
          handler: () =>
            modalController
              .create({
                component: defineAsyncComponent(
                  () => import('../../components/JSONViewer.vue'),
                ),
                componentProps: {
                  data: parseResult,
                },
              })
              .then((m) => m.present()),
        },
      ],
    });
  }
};
</script>
