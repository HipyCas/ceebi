declare global {
  interface ComponentCustomProperties {
    readonly $t: (m: string) => string;
  }
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
