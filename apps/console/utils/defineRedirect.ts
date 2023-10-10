import type { NavigateToOptions } from 'nuxt/dist/app/composables/router';

export default (url: string | (() => string), options?: NavigateToOptions) =>
  defineComponent({
    setup() {
      if (typeof url === 'string') navigateTo(url, options);
      else navigateTo(url(), options);
    },
    render() {},
  });
