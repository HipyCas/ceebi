import baseTailwindCSSConfig from '../../tailwind.config';

const FormKitVariants = require('@formkit/themes/tailwindcss');

module.exports = baseTailwindCSSConfig(__dirname, {
  plugins: [FormKitVariants],
  daisyui: {
    base: false,
    prefix: 'd-',
  },
});
