import type { CapacitorConfig } from '@capacitor/cli';
import packageJSON from './package.json';
import { join } from 'path';

/**
 * Get base Capacitor config
 * @param dirname Pass __dirname
 * @param project Project name, to match with pass and nx
 * @param plugins A string array of the Capacitor plugins to include in the build
 * @param customConfig Customize the configuration, keep in mind this is destructured at the end of the config, thus overwriting anything set before by this function
 */
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
    ios: {
      path: join(dirname, '../../ios', project),
    },
    includePlugins: plugins,
    ...customConfig,
  } as CapacitorConfig);
