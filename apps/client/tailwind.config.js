// const { createGlobPatternsForDependencies } = require('@nx-plus/vite/');
const { join } = require('path');

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app,index}/**/*!(*.stories|*.spec).{ts,tsx,html,vue}'
    ),
    // ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
