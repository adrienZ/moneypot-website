/** @type {import('tailwindcss/types/config').PluginCreator} */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {},
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".title-1": {
          "@apply font-bold text-3xl": {}
        }
      });
    })
  ]
};
