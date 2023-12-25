// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: [
    "@moneypot/ui",
    "@moneypot/auth",
  ],
  runtimeConfig: {
		githubClientId: "",
		githubClientSecret: ""
  },
  typescript: {
    strict: true,
  }
})
