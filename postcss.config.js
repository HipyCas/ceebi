const { join } = require('path');

/**
 * Get base PostCSS config
 * @param {string} dirname Pass __dirname
 * @returns PostCSS Config
 */
module.exports = (dirname) => ({
  plugins: {
    tailwindcss: {
      config: join(dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
});
