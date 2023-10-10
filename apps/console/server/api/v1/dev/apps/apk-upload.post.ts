import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { readFiles } from 'h3-formidable';
import path from 'path';
import { z } from 'zod';

const QuerySchema = z.object({
  version: z.string(),
  appProjectId: z.string(),
});

// https://github.com/node-formidable/formidable
// https://stackoverflow.com/questions/33570989/how-to-get-permissions-to-create-a-file-directory-with-node-fs

type Query = z.infer<typeof QuerySchema>;

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Query;

  const { success } = QuerySchema.safeParse(query);
  if (!success)
    throw createError({
      message: 'missing query parameters',
      statusCode: 400,
    });

  const versionFolder = `/home/hipy/ceebi/code2/apps/console/public/apps/versions/${query.appProjectId}`;

  if (!existsSync(versionFolder)) await mkdir(versionFolder);
  console.log('made dir');

  await readFiles(event, {
    uploadDir: versionFolder,
    filename: () => `${query.version}.apk`,
    maxFiles: 1,
  });
  return path.join(
    `/apps/versions/${query.appProjectId}/`,
    `${query.version}.apk`
  );
});
