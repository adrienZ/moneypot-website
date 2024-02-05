export default defineAppConfig({
  /**
   * https://github.com/nuxt-modules/icon/issues/117
   *
   * there is a stringe error when using
   * vue-tsc during build (https://nuxt.com/docs/api/nuxt-config#typecheck)
   * we want to avoid changing tsconfig (enable skipLibCheck)
   * so we use this workaround
   */
  nuxtIcon: {}
});
