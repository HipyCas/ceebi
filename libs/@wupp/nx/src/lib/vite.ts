import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import AutoImport from 'unplugin-auto-import/vite';

export const extendBaseConfig = (
  projectName: string,
  _dirname: string,
  extraConfig: ExtraConfig
) =>
  defineConfig({
    plugins: [
      vue(extraConfig.plugins.extend.vue),
      tsconfigPaths({
        loose: true,
        ...extraConfig.plugins.extend.tsconfigPaths,
      }),
      // partytownVite({
      //   dest: join(_dirname, 'public', '~partytown'),
      // }),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            mode: '',
          },
        },
        ...extraConfig.plugins.extend.createHtmlPlugin,
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
              'onIonViewWillEnter',
              'onIonViewDidEnter',
            ],
            '@capacitor/preferences': ['Preferences'],
            '@capacitor/browser': ['Browser'],
            '@capacitor/clipboard': ['Clipboard'],
          },
          {
            from: '@code/wp-types',
            imports: ['WPUser'],
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
        ...extraConfig.plugins.extend.AutoImport,
      }),
    ],
    root: _dirname,
    build: {
      outDir: `../../dist/apps/${projectName}/web`,
      emptyOutDir: true,
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
    ...extraConfig.extend,
  });

export interface ExtraConfig {
  plugins: {
    extend: Record<
      'vue' | 'tsconfigPaths' | 'createHtmlPlugin' | 'AutoImport',
      any
    >;
  };
  extend: UserConfig;
}
