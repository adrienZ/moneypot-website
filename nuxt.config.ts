import { fileURLToPath } from "node:url";
const isDev = process.env.NODE_ENV === "development";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: [
    "@nuxt/devtools",
    "@vue-email/nuxt",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxt/image"
  ],
  alias: {
    "#myauth": fileURLToPath(new URL("./server/lib/auth", import.meta.url))
  },
  runtimeConfig: {
    githubClientId: "",
    githubClientSecret: ""
  },
  typescript: {
    strict: true,
    shim: false,
    typeCheck: process.env.NODE_ENV === "production"
  },
  experimental: {
    typedPages: true
  },
  vueEmail: {
    // seems to be needed in prod
    autoImport: true,
    baseUrl: process.env.BASE_URL
  },

  ui: {
    global: true,
    icons: ["heroicons", "logos"]
  },
  // vscode debugging
  sourcemap: isDev
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string;
      RESEND_API_KEY?: string;
      RESEND_AUDIENCE_ID?: string;
      GITHUB_CLIENT_ID?: string;
      GITHUB_CLIENT_SECRET?: string;
      BASE_URL?: string;
      UPLOADTHING_SECRET?: string;
      UPLOADTHING_APP_ID?: string;
    }
  }
}
