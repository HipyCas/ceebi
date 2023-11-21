import { defineNuxtConfig } from 'nuxt/config';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

/**
 * read the compilerOptions.paths option from a tsconfig and return as aliases for Nuxt
 **/
function getMonorepoTsConfigPaths(tsConfigPath: string) {
  const tsPaths = require(tsConfigPath)?.compilerOptions?.paths as Record<
    string,
    string[]
  >;

  const alias: Record<string, string> = {};
  if (tsPaths) {
    for (const p in tsPaths) {
      // '@org/something/*': ['libs/something/src/*'] => '@org/something': '{pathToWorkspaceRoot}/libs/something/src'
      alias[p.replace(/\/\*$/, '')] = join(
        workspaceRoot,
        tsPaths[p][0].replace(/\/\*$/, ''),
      );
    }
  }

  return alias;
}

// https://nuxt.com/docs/api/configuration/nuxt-config
const config = defineNuxtConfig({
  /**
   * aliases set here will be added to the auto generate tsconfig by Nuxt
   * https://nuxt.com/docs/guide/directory-structure/tsconfig
   **/
  // @ts-ignore For some reason it says that alias does not exist on config option
  alias: getMonorepoTsConfigPaths('../../tsconfig.base.json'),
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
        {
          rel: 'preconnect',
          href: 'https://biociencias.es',
        },
      ],
    },
  },
  css: ['floating-vue/dist/style.css', '~/assets/css/index.css'],

  modules: ['@nuxtjs/tailwindcss', '@formkit/nuxt'],
  i18n: {
    vueI18n: './i18n.config.ts', // TODO this does not work, see fixme in file
  },

  runtimeConfig: {
    privatePath: '',
    redis: {
      port: 0,
      host: '',
    },
  },

  nitro: {
    devStorage: {
      db: {
        driver: 'fs',
        base: './db',
      },
    },
  },
});
console.info('conf', config);

export default config;
