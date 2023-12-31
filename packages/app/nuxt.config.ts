// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  extends: [
    "@moneypot/ui",
    "@moneypot/auth",
  ],
  modules: [
    '@nuxt/devtools',
    '@vue-email/nuxt'
  ],
  runtimeConfig: {
		githubClientId: "",
		githubClientSecret: ""
  },
  typescript: {
    strict: true,
  },
  experimental: {
    typedPages: true
  },
  vueEmail: {
    baseUrl: 'htpp://localhost:3000',
    autoImport: true,
  }
})
