import { CapacitorConfig } from '@capacitor/cli';
import packageJSON from '../../package.json';

export default {
  appId: 'es.biociencias.ceebi',
  appName: 'CEEBI',
  webDir: '../../dist/apps/client/web', // ? Change this to /dist/web/admin and /dist/apps/android/admin?
  bundledWebRuntime: false,
  android: {
    path: '../../android/client', // ? Change this to /dist/apps/admin/apps?
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  includePlugins: Object.keys(packageJSON.dependencies).filter((pkg) =>
    pkg.includes('capacitor')
  ),
} as CapacitorConfig;
