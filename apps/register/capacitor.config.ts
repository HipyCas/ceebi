import { CapacitorConfig } from '@capacitor/cli';
import plugins from './capacitor-plugins.json';

export default {
  appId: 'es.biociencias.testid',
  appName: 'test',
  webDir: '../../dist/apps/register/web', // ? Change this to /dist/web/admin and /dist/apps/android/admin?
  bundledWebRuntime: false,
  android: {
    path: '../../dist/apps/register/android', // ? Change this to /dist/apps/admin/apps?
  },
  includePlugins: plugins,
} as CapacitorConfig;
