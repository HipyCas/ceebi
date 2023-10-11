# CEEBI Software

This repository holds the monorepo of all apps used in the CEEBI Congress.

The first client app was originally hosted on the repo [biocienciasgrx/ceebi](https://github.com/biocienciasgrx/ceebi/), but the project has grown since then and now hosts another mobile app, a web console and a desktop utility alongside multiple shared libraries for easier development.

<!-- TODO Add reference to template repo -->

## About the project

## File structure

The repository might look a bit overwhelming at first with many files and folders, but it follows a logic and useful structure, explained below

### Config files

All config files extend from a shared base config located in the root directory. To this point, there are base config files for TailwindCSS (`tailwind.config.js`), PostCSS (`postcss.config.js`), Vite (`vite.config.ts`) and Capacitor (`capacitor.config.ts`). Except the Vite base config, all export a function as default, while Vite base config exports a named `extendBaseConfig` method.

This architecture for config files ensures a consistent configuration across all projects, both in the user experience and the developer experience. All base config files also allow to extend and modify the config to some extent.

Inside each project's config file, the base config method is imported and is used to generate the project's configuration, for example with the Client's capacitor config app:

```ts
import extendConfig from '../../capacitor.config';
import capPlugins from './capacitor-plugins.json';

export default extendConfig(__dirname, 'client', capPlugins, {
  appId: 'es.biociencias.ceebi',
  appName: 'CEEBI',
});
```

### `libs` directory

This directory contains libraries used by many or all apps in the project, making life easier in the development side and making fetching data, logging errors and other standard tasks more consistent between executions.

### `apps` directory

Contains the source code for the different apps making up this project. This apps extend the previously mentioned base config and make use of the different shared libraries. The output of their builds goes into the `dist` directory (not committed to the repo)

### `android` and `ios` directories

This directories contain the generated and tweaked Capacitor Android and iOS projects. They are committed as they present files manually changed while the output of the source code of the apps is not and has to be generated in order for the native app to work.

### `locales` directory

This directory holds the different translations in a YAML format. This translations are loaded with the Vite plugin `@intlify/unplugin-vue-i18n` and are used in-code with the `vue-i18n` library. There is also a `project.babel` file which holds project info to work with the translations in the BabelEdit desktop application.
