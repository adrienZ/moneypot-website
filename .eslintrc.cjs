/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "@nuxt/eslint-config",
    "plugin:sonarjs/recommended",
    "@vue/eslint-config-prettier"
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  ignorePatterns: ["assets/presets/primevue/**/*.js"],
  overrides: [
    {
      files: [
        // These pages are not used directly by users so they can have one-word names.
        "**/emails/**/*.vue"
      ],
      rules: { "vue/multi-word-component-names": "off" }
    }
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    // import with type attribute when importing types
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-import-type-side-effects": "error"
  }
};
