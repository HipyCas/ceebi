import { load as loadEnv } from 'dotenv-extended';
import { defineConfig } from 'vite';
import type { PluginOption, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import Unfonts from 'unplugin-fonts/vite';
import AutoImport from 'unplugin-auto-import/vite';

loadEnv();

export const extendBaseConfig = (
  projectName: string,
  dirname: string,
  extraConfig?: ExtraConfig
) =>
  defineConfig({
    plugins: [
      vue(extraConfig?.plugins?.extend?.vue),
      tsconfigPaths({
        loose: true,
        ...extraConfig?.plugins?.extend?.tsconfigPaths,
      }),
      // partytownVite({
      //   dest: join(_dirname, 'public', '~partytown'),
      // }),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            mode:
              process.env.IONIC_MODE === undefined
                ? ''
                : `mode=${process.env.IONIC_MODE}`,
          },
        },
        ...extraConfig?.plugins?.extend?.createHtmlPlugin,
      }),
      Unfonts({
        fontsource: {
          families: ['Source Sans Pro'],
        },
        ...extraConfig?.plugins?.extend?.Unfonts,
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          {
            '@code/supabase': ['useSupabase'],
            '@code/logger': ['useLogger'],
            '@code/ceebi-ui': ['useToast'],
            '@ionic/vue': [
              'useIonRouter',
              'IonItem',
              'IonInput',
              'IonLabel',
              'IonButton',
              'IonSearchbar',
              'IonText',
              'IonFab',
              'IonFabButton',
              'IonIcon',
              'IonNote',
              'IonImg',
              'onIonViewWillEnter',
              'onIonViewDidEnter',
              'isPlatform',
            ],
            '@capacitor/preferences': ['Preferences'],
            '@capacitor/browser': ['Browser'],
            '@capacitor/clipboard': ['Clipboard'],
            '@capacitor/share': ['Share'],
            '@capacitor/filesystem': ['Filesystem', 'Directory'],
            '@capacitor-community/screen-brightness': ['ScreenBrightness'],
            '@capacitor/network': ['Network'],
            '@capacitor/haptics': ['Haptics', 'NotificationType'],
            '@capacitor/toast': ['Toast'],
            '@capacitor-community/barcode-scanner': [
              'BarcodeScanner',
              'SupportedFormat',
            ],
            '@capacitor/app': ['App'],
          },
          {
            from: '@code/wp-types',
            imports: ['WPUser', 'WPNotification'],
            type: true,
          },
          {
            from: '@code/logger',
            imports: [
              ['Msg', 'LoggerMsg'],
              ['LogLevel', 'LoggerLogLevel'],
            ],
            type: true,
          },
          // FIXME Clipboard import not working, problems with type
          // {
          //   from: '@capcitor/clipboard',
          //   imports: [['ClipboardPlugin', 'Clipboard']],
          //   type: true,
          // },
        ],
        vueTemplate: true,
        defaultExportByFilename: true,
        dirs: ['./src/components'],
        dts: './src/auto-imports.d.ts',
        ...extraConfig?.plugins?.extend?.AutoImport,
      }),
      ...(extraConfig?.plugins?.include === undefined
        ? []
        : extraConfig?.plugins?.include),
    ],
    root: dirname,
    build: {
      outDir: `../../dist/apps/${projectName}/web`,
      emptyOutDir: true,
    },
    server: {
      fs: {
        allow: [__dirname],
      },
    },
    // resolve: {
    //   alias: Object.entries(baseTsConfig.compilerOptions.paths).reduce(
    //     (acc, [key, paths]) => ({
    //       ...acc,
    //       [key]: (paths as string[]).map((path) => join(appRootPath, path)),
    //     }),
    //     {}
    //   ),
    // },
    ...extraConfig?.extend,
  });

export interface ExtraConfig {
  plugins?: {
    extend?: Record<
      'vue' | 'tsconfigPaths' | 'createHtmlPlugin' | 'AutoImport' | 'Unfonts',
      any
    >;
    include?: PluginOption[];
  };
  extend?: UserConfig;
}
