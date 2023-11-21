import { z } from 'zod';

export const projectNameInput = z.object({
  projectName: z.string(),
});

export const certificateConfigInputSchema = z.object({
  projectName: z.string(),
  fields: z.object({ downloadDate: z.string() }),
});

export type CertificateConfig = z.infer<typeof certificateConfigInputSchema>;

export const certificateConfigOutputSchema = z.object({
  downloadDate: z.string().nullable(),
});

const baseWordpressURL = z.string().url();
const restrictedPages = z.array(
  z.union([
    z.literal('Notificaciones'),
    z.literal('QR y Asistencia'),
    z.literal('Noticias'),
    z.literal('Horario'),
    z.literal('Sobre y Patrocinadores'),
  ]),
);

export const authenticationConfigInputSchema = z.object({
  projectName: z.string(),
  fields: z.object({
    baseWordpressURL,
    restrictedPages,
  }),
});

export type AuthenticationConfig = z.infer<
  typeof authenticationConfigInputSchema
>;

export const authenticationConfigOutputSchema = z.object({
  baseWordpressURL: baseWordpressURL.nullable(),
  restrictedPages: restrictedPages.nullable(),
});
