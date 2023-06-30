const { join } = require('path');

/** @type {(string) => import('tailwindcss').Config} */
module.exports = (dirname) => ({
  content: [
    join(
      dirname,
      '{src,pages,components,app,index}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html,vue}'
    ),
    // ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
