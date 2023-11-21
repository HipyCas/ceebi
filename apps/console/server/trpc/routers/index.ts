import { TRPCError } from '@trpc/server';
import { sift } from 'radash';
import { z } from 'zod';
import {
  authenticationConfigInputSchema,
  authenticationConfigOutputSchema,
  certificateConfigInputSchema,
  certificateConfigOutputSchema,
  projectNameInput,
} from '../schema';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import {
  AppSchema,
  AppWithRelationsSchema,
  OrganizationCreateInputSchema,
  OrganizationSchema,
  OrganizationSelectSchema,
  OrganizationUpdateArgsSchema,
  OrganizationUpdateInputSchema,
  OrganizationWhereInputSchema,
  ProjectCreateInputSchema,
  ProjectFindManyArgsSchema,
  ProjectFindUniqueArgsSchema,
  ProjectSchema,
  ProjectTokenSchema,
  AppProjectSchema,
  ProjectWithRelationsSchema,
  AppVersionSchema,
  AppVersionCreateInputSchema,
  OrganizationIncludeSchema,
  AppProjectIncludeSchema,
} from '@prisma/source/schemas';
import { validate } from 'uuid';
import { readFile, writeFile } from 'fs/promises';

// TODO Try https://github.com/omar-dulaimi/trpc-shield

const prisma = new PrismaClient();

const validateToken = async (input: {
  token: string;
  organizationID: string;
}) => {
  if (!validate(input.token))
    throw createError({
      message: 'token not valid',
      code: 400,
    });

  const projectToken = await prisma.projectToken.findUnique({
    where: {
      id: input.token,
      organizationId: input.organizationID,
    },
    include: {
      enabled_apps: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!projectToken)
    throw createError({
      message: 'project token not found',
      code: 404,
    });

  console.log(projectToken);
  return projectToken;
};

const basicAppData = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string().startsWith('/'),
});

export const appRouter = router({
  getApps: publicProcedure
    .input(z.object({ projectId: z.string().cuid() }))
    // .output(z.array())
    .query(async ({ input }) => {
      // return sift([
      //   {
      //     name: 'Client',
      //     description: 'Aplicación para los asistentes al congreso',
      //     icon: '/apps/icons/client.png',
      //   },
      //   {
      //     name: 'Admin',
      //     description: 'Aplicación de administración y registro de asistencia',
      //     icon: '/apps/icons/admin.png',
      //   },
      //   input.projectName === 'II CEEBI'
      //     ? null
      //     : {
      //         name: 'Console',
      //         description: 'Panel web para la gestión del evento',
      //         icon: '/apps/icons/admin.png',
      //       },
      // ]);
      return await prisma.appProject.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          app: true,
        },
      });
    }),
  // getApp: publicProcedure
  //   .input(
  //     projectNameInput.extend({
  //       appName: z.union([
  //         z.literal('client'),
  //         z.literal('admin'),
  //         z.literal('console'),
  //       ]),
  //     })
  //   )
  //   .output(
  //     basicAppData.extend({
  //       version: z.object({
  //         latest: z.string(),
  //         frozen: z.boolean(),
  //       }),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     switch (input.appName) {
  //       case 'client':
  //         return {
  //           name: 'Client',
  //           description: 'Aplicación para los asistentes al congreso',
  //           icon: '/apps/icons/client.png',
  //           version: {
  //             latest:
  //               input.projectName === 'II CEEBI'
  //                 ? 'v2.0.1'
  //                 : 'v2024.0.0-alpha.1',
  //             frozen: input.projectName === 'II CEEBI' ? true : false,
  //           },
  //         };
  //       case 'admin':
  //       case 'console':
  //         throw new TRPCError({
  //           code: 'NOT_IMPLEMENTED',
  //           message: 'This app is not yet implemented in the tRPC API',
  //         });
  //       default:
  //         throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: 'The app you were looking for was not found',
  //         });
  //     }
  //   }),

  getProjectConfig: publicProcedure
    .input(z.object({ projectId: z.string().cuid() }))
    .query(
      async ({ input }) =>
        await prisma.project.findUniqueOrThrow({
          where: {
            id: input.projectId,
          },
          select: {
            certificatesAttendancePercent: true,
            certificatesDownloadDatetime: true,
          },
        }),
    ),

  setCertificateConfig: publicProcedure
    .input(certificateConfigInputSchema)
    .mutation(async ({ input }) => {
      await useStorage('db').setItem(
        `${input.projectName}.certificateDownloadDate`,
        input.fields.downloadDate,
      );
      console.log(
        'set',
        await useStorage('db').getItem(
          `${input.projectName}.certificateDownloadDate`,
        ),
      );
    }),

  getCertificateConfig: publicProcedure
    .input(
      z.object({
        projectName: z.string(),
      }),
    )
    // .output(certificateConfigOutputSchema)
    .query(async ({ input }) => ({
      downloadDate: await useStorage('db').getItem(
        `${input.projectName}.certificateDownloadDate`,
      ),
    })),

  setAuthenticationConfig: publicProcedure
    .input(authenticationConfigInputSchema)
    .mutation(async ({ input }) => {
      await useStorage('db').setItem(
        `${input.projectName}.authenticationBaseWordpressURL`,
        input.fields.baseWordpressURL,
      );
      await useStorage('db').setItem(
        `${input.projectName}.authenticationRestrictedPages`,
        input.fields.restrictedPages,
      );
    }),
  getAuthenticationConfig: publicProcedure
    .input(
      z.object({
        projectName: z.string(),
      }),
    )
    .output(authenticationConfigOutputSchema)
    .query(
      async ({ input }) =>
        ({
          baseWordpressURL: await useStorage('db').getItem(
            `${input.projectName}.authenticationBaseWordpressURL`,
          ),
          restrictedPages: await useStorage('db').getItem(
            `${input.projectName}.authenticationRestrictedPages`,
          ),
        }) as z.infer<typeof authenticationConfigOutputSchema>,
    ),

  // TODO This is a dev thing
  setLegacy: publicProcedure
    .input(
      // TODO Move this that you use often to ../schema.ts and make the other inputs merge with this
      z.object({
        projectName: z.string(),
      }),
    )
    .output(z.void())
    .mutation(async ({ input }) => {
      await useStorage('db').setItem(`${input.projectName}.legacy`, true);
    }),
  // TODO This can see both admin and dev
  getLegacy: publicProcedure
    .input(
      z.object({
        projectName: z.string(),
      }),
    )
    .output(
      z.object({
        legacy: z.boolean().nullable(),
      }),
    )
    .query(async ({ input }) => ({
      legacy: await useStorage('db').getItem(`${input.projectName}.legacy`),
    })),

  listOrganizations: publicProcedure
    .input(
      z.object({
        where: OrganizationWhereInputSchema.optional(),
        include: OrganizationIncludeSchema.optional(),
      }),
    )
    // .output(OrganizationSchema.array())
    .query(
      async ({ input: { where, include } }) =>
        await prisma.organization.findMany({ where, include }),
    ),

  getOrganization: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        select: OrganizationSelectSchema.optional(),
      }),
    )
    .output(OrganizationSchema)
    .query(async ({ input }) => {
      const org = await prisma.organization.findFirstOrThrow({
        where: {
          id: input.id,
        },
        select: input.select,
      });
      return org;
    }),

  updateOrganization: publicProcedure
    .input(OrganizationUpdateArgsSchema)
    .output(OrganizationSchema)
    .mutation(async ({ input }) => await prisma.organization.update(input)),

  createOrganization: publicProcedure
    .input(OrganizationCreateInputSchema)
    .output(z.void())
    .mutation(async ({ input }) => {
      return;
      // return await prisma.organization.create({
      //   data: input,
      // });
    }),

  listProjects: publicProcedure
    .input(ProjectFindManyArgsSchema)
    .output(
      ProjectSchema.merge(
        z.object({
          status: z.enum(['active', 'conservation', 'suspended']),
        }),
      ).array(),
    )
    //@ts-expect-error I know it will be that enum, but in DB I cannot write that enum bc its sqlite
    .query(async ({ input }) => await prisma.project.findMany(input)),

  getProject: publicProcedure
    .input(ProjectFindUniqueArgsSchema)
    .output(ProjectSchema.merge(z.object({ end: z.date() })).nullable()) //
    .query(async ({ input }) => await prisma.project.findUnique(input)),

  getAndVerifyToken: publicProcedure
    .input(
      z.object({
        token: z.string().uuid(),
        organizationID: z.string(),
      }),
    )
    .output(
      ProjectTokenSchema.merge(
        z.object({
          enabled_apps: z.object({ name: z.string(), id: z.string() }).array(),
        }),
      ),
    )
    .query(async ({ input }) => await validateToken(input)),

  //? TODO Can I make this only work under certain routes? Maybe with ctx
  createProject: publicProcedure
    .input(
      z.object({
        token: z.string(),
        organizationID: z.string(),
        projectInfo: ProjectSchema.pick({
          name: true,
          end: true,
        }),
      }),
    )
    .output(
      z.object({
        projectID: z.string().cuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const projectToken = await validateToken(input);

      const project = await prisma.project.create({
        data: {
          ...input.projectInfo,
          organizationId: input.organizationID,
          apps: {
            create: projectToken.enabled_apps.map((app) => ({
              appId: app.id,
            })),
          },
        },
      });

      await prisma.projectToken.delete({
        where: {
          id: input.token,
          organizationId: input.organizationID,
        },
      });

      return { projectID: project.id };
    }),

  listApps: publicProcedure
    .output(
      AppSchema.merge(
        z.object({
          _count: z.object({
            appProjects: z.number(),
          }),
          appProjects: z
            .object({
              project: z.object({
                organization: OrganizationSchema,
              }),
            })
            .array(),
        }),
      ).array(),
    )
    .query(
      async () =>
        await prisma.app.findMany({
          include: {
            _count: {
              select: { appProjects: true },
            },
            appProjects: {
              select: {
                project: {
                  select: {
                    organization: true,
                  },
                },
              },
            },
          },
        }),
    ),

  getApp: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .output(
      AppSchema.merge(
        z.object({
          appProjects: AppProjectSchema.merge(
            z.object({
              project: ProjectSchema.merge(
                z.object({
                  organization: OrganizationSchema,
                }),
              ),
              versions: AppVersionSchema.array(),
            }),
          ).array(),
        }),
      ).nullable(),
    )
    .query(
      async ({ input }) =>
        await prisma.app.findUnique({
          where: {
            id: input.id,
          },
          include: {
            appProjects: {
              include: {
                project: {
                  include: {
                    organization: true,
                  },
                },
                versions: true,
              },
            },
          },
        }),
    ),

  getAppProject: publicProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        appId: z.string().cuid(),
      }),
    )
    .query(
      async ({ input }) =>
        await prisma.appProject.findUniqueOrThrow({
          where: {
            appId_projectId: {
              appId: input.appId,
              projectId: input.projectId,
            },
          },
          include: {
            app: true,
            versions: true,
          },
        }),
    ),

  getAppsWithProjects: publicProcedure.query(
    async () =>
      await prisma.app.findMany({
        include: {
          appProjects: {
            include: {
              project: {
                select: {
                  name: true,
                  organization: {
                    select: {
                      initials: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
  ),

  // uploadVersionAPK: publicProcedure.input(z.object({
  //   version: z.string(),
  //   formData: z.instanceof(FormData)
  // })).mutation(async () => )

  createVersion: publicProcedure
    .input(
      AppVersionSchema.omit({ id: true }).merge(
        z.object({ notes: z.string(), appId: z.string().cuid() }),
      ),
    )
    .output(AppVersionSchema)
    .mutation(async ({ input }) => {
      const version = await prisma.appVersion.create({
        data: {
          code: input.code,
          date: input.date,
          appProjectId: input.appProjectId,
        },
      });

      try {
        await writeFile(
          `/home/hipy/ceebi/code2/apps/console/public/apps/notes/${input.appId}/${version.code}.md`,
          input.notes ?? '',
        );
      } catch (e) {
        console.error('internal error saving notes', e);
        throw createError({
          message: 'internal error saving notes',
          statusCode: 500,
        });
      }

      return version;
    }),

  getPublicProjectApps: publicProcedure
    .output(
      AppProjectSchema.merge(
        z.object({
          app: AppSchema,
          project: ProjectSchema,
          versions: AppVersionSchema.array(),
        }),
      ).array(),
    )
    .query(
      async () =>
        await prisma.appProject.findMany({
          where: {
            public: true,
          },
          include: {
            project: true,
            app: true,
            versions: true,
          },
        }),
    ),
});

export type AppRouter = typeof appRouter;
