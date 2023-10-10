import { generateClasses } from '@formkit/themes';
import { es } from '@formkit/i18n';
import myTailwindTheme from './tailwind-theme.js'; // change to your theme's path
import { createAutoAnimatePlugin } from '@formkit/addons';

export default {
  // icons: {
  // ...genesisIcons,
  // },
  iconLoaderUrl: (iconName) =>
    `https://unpkg.com/@tabler/icons@2.32.0/icons/${iconName}.svg`,
  config: {
    classes: generateClasses(myTailwindTheme),
  },
  locales: { es },
  locale: 'es',
  plugins: [createAutoAnimatePlugin()],
};
