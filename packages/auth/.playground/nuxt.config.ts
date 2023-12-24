export default defineNuxtConfig({
  extends: ['..'],
  runtimeConfig: {
		githubClientId: "",
		githubClientSecret: ""
  },
  typescript: {
    strict: true,
  }
})
