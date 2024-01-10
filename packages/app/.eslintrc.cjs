/* eslint-env node */
module.exports = {
  extends: ["@nuxt/eslint-config", "@vue/eslint-config-prettier"],
  parserOptions: {
    ecmaVersion: "latest"
  },
  overrides: [
    {
      files: [
        // These pages are not used directly by users so they can have one-word names.
        "**/emails/**/*.vue"
      ],
      rules: { "vue/multi-word-component-names": "off" }
    }
  ]
};
