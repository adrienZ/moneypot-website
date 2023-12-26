export default defineNuxtConfig({
  devtools: { 
    enabled: true,
  },
  modules: [
    '@nuxt/devtools',
  ],
  extends: ['@moneypot/auth'],
  runtimeConfig: {
    githubClientId: "",
    githubClientSecret: ""
  },
  typescript: {
    strict: true,
  }
})
