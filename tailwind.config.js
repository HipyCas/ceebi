const { join } = require('path');

/** @type {(string) => import('tailwindcss').Config} */
module.exports = (dirname) => ({
  presets: [require('./tailwind.preset')],
  content: [
    join(
      dirname,
      '{src,pages,components,app,index}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html,vue}'
    ),
    // ...createGlobPatternsForDependencies(__dirname),
  ],
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [],
});
