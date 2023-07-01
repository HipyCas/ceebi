import extendConfig from '../../capacitor.config';
import capPlugins from './capacitor-plugins.json';

export default extendConfig(__dirname, 'admin', capPlugins, {
  appId: 'es.biociencias.admin',
  appName: 'CEEBI Admin',
});
