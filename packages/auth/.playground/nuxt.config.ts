export default defineNuxtConfig({
  devtools: { 
    enabled: true,
  },
  modules: [
    '@nuxt/devtools',
  ],
  extends: ['..'],
  runtimeConfig: {
    githubClientId: "",
    githubClientSecret: ""
  },
  typescript: {
    strict: true,
  }
})
