/* eslint-env node */
module.exports = {
  env: {
    node: true,
    es2020: true
  },
  ignorePatterns: [
    "**/js-numbers.js",
    "**/js-numbers.cjs",
    "docs/",
    "dist/",
    "jest.config.js"
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-this-alias": "off",
  }
};
