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
    baseUrl: 'http://localhost:3000',
  }
})


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY?: string;
      TURSO_DB_URL?: string;
      TURSO_DB_TOKEN?: string
    }
  }
}
