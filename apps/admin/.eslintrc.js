module.exports = {
  extends: ['../../.eslintrc.json', 'prettier'],
  rules: {},
  ignorePatterns: ['!**/*'],
  env: { node: true },
  overrides: [{ files: ['**/*.spec.{j,t}s?(x)'], env: { jest: true } }],
};
