<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { Project, ProjectSchema } from '@prisma/source/schemas';
import { z } from 'zod';

definePageMeta({
  layout: 'admin-project',
});

const { $trpc } = useNuxtApp();
const route = useRoute();

const mergedProject = ProjectSchema.merge(z.object({ end: z.string() }));
type MergedProject = z.infer<typeof mergedProject>;
const project = useState<MergedProject | null>('project', () => null);
(async () =>
  (project.value = await $trpc.getProject.query({
    where: {
      id: route.params.project as string,
    },
  })))();
</script>
