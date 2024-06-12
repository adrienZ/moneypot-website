import { fileURLToPath } from "node:url";
import pkg from "./package.json";

const isDev = process.env.NODE_ENV === "development";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: [
    "@nuxt/devtools",
    "@vue-email/nuxt",
    "@nuxt/ui", // "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "nuxt-primevue",
    "@nuxt/eslint"
  ],
  css: ["~/assets/css/main.css"],
  tailwindcss: {
    cssPath: false
  },
  alias: {
    "#myauth": fileURLToPath(new URL("./server/lib/auth", import.meta.url))
  },
  runtimeConfig: {
    githubClientId: "",
    githubClientSecret: "",
    public: {
      clientVersion: pkg.version
    }
  },

  typescript: {
    strict: true,
    shim: false,
    // https://github.com/vuejs/language-tools/issues/3969
    // disabled while this is an issue use pakcage.json script instead
    typeCheck: false
    // typeCheck: process.env.NODE_ENV === "production"
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
  primevue: {
    importPT: {
      from: fileURLToPath(new URL("./assets/presets/primevue", import.meta.url))
    },
    options: {
      unstyled: true
      // pt: PrimeTheme
    },
    components: {
      prefix: "Prime",
      include: []
    },
    directives: {
      include: []
    },
    composables: {
      include: []
    }
  },
  // vscode debugging
  sourcemap: isDev
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string;
      RESEND_API_KEY?: string;
      RESEND_AUDIENCE_ID?: string;
      GITHUB_CLIENT_ID?: string;
      GITHUB_CLIENT_SECRET?: string;
      LINKEDIN_CLIENT_ID?: string;
      LINKEDIN_CLIENT_SECRET?: string;
      BASE_URL?: string;
      UPLOADTHING_SECRET?: string;
      UPLOADTHING_APP_ID?: string;
      STRIPE_SECRET_KEY?: string;
      STRIPE_MY_COMPANY_ACCOUNT_ID?: string;
    }
  }
}

declare module "nuxt/schema" {
  // interface RuntimeConfig {
  // }
  interface PublicRuntimeConfig {
    clientVersion: string;
  }
}
