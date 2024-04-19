import withNuxt from "./.nuxt/eslint.config.mjs";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default withNuxt(
  // ...compat.extends("plugin:sonarjs/recommended"),
  ...compat.extends("@vue/eslint-config-prettier"),
  {
    rules: {
      // https://eslint.nuxt.com/packages/plugin#nuxtprefer-import-meta
      "nuxt/prefer-import-meta": "error",
      "@typescript-eslint/no-extraneous-class": "warn"
    }
  },
  {
    files: [
      // These pages are not used directly by users so they can have one-word names.
      "**/emails/**/*.vue"
    ],
    rules: { "vue/multi-word-component-names": "off" }
  },
  {
    ignores: ["assets/presets/primevue/**/*.js"]
  }
);
