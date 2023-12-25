export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['..'],
  runtimeConfig: {
    githubClientId: "",
    githubClientSecret: ""
  },
  typescript: {
    strict: true,
  }
})
