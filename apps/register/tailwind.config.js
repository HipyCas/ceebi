// const { createGlobPatternsForDependencies } = require('@nx-plus/vite/');
const baseTailwindConfig = require('../../tailwind.config');

module.exports = {
  ...baseTailwindConfig(__dirname),
};
