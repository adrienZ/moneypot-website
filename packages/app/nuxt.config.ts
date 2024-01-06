import { fileURLToPath } from "node:url";
const isDev = process.env.NODE_ENV === "development";

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
  alias: {
    "#myauth": fileURLToPath(new URL('./server/lib/auth', import.meta.url))
  },
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
    // seems to be needed in prod
    autoImport: true,
    baseUrl: 'http://localhost:3000',
  },
  // debugging
  sourcemap: isDev
})


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY?: string;
      TURSO_DB_URL?: string;
      TURSO_DB_TOKEN?: string
      GITHUB_CLIENT_ID?: string
      GITHUB_CLIENT_SECRET?: string
    }
  }
}
