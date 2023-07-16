import extendConfig from '../../capacitor.config';
import capPlugins from './capacitor-plugins.json';

export default extendConfig(__dirname, 'client', capPlugins, {
  appId: 'es.biociencias.ceebi',
  appName: 'CEEBI',
  plugins: {
    // CapacitorHttp: {
    //   enabled: true,
    // },
  },
});
