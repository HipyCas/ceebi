import type { CapacitorConfig } from '@capacitor/cli';
import packageJSON from './package.json';
import { join } from 'path';

export default (
  dirname: string,
  project: string,
  plugins: string[],
  customConfig?: CapacitorConfig
) =>
  ({
    webDir: join(dirname, `../../dist/apps/${project}/web`), // ? Change this to /dist/web/admin and /dist/apps/android/admin?
    bundledWebRuntime: false,
    android: {
      path: join(dirname, '../../android', project), // ? Change this to /dist/apps/admin/apps?
    },
    includePlugins: plugins,
    ...customConfig,
  } as CapacitorConfig);
