import { CapacitorConfig } from '@capacitor/cli';
import packageJSON from '../../package.json';

export default {
  appId: 'es.biociencias.admin',
  appName: 'CEEBI Admin',
  webDir: '../../dist/apps/admin/web', // ? Change this to /dist/web/admin and /dist/apps/android/admin?
  bundledWebRuntime: false,
  android: {
    path: '../../android/admin', // ? Change this to /dist/apps/admin/apps?
  },
  includePlugins: [
    ...Object.keys(packageJSON.dependencies).filter((pkg) =>
      pkg.includes('capacitor')
    ),
    '@capacitor/toast',
  ],
} as CapacitorConfig;
