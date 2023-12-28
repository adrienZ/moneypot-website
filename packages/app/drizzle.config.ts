import { join } from 'pathe'
import { defineConfig } from 'drizzle-kit'

const driver:"better-sqlite" | "turso" = "better-sqlite";
const isDev = driver === "better-sqlite"
const dbCredentials = isDev ? {
  url: join(__dirname, './db.sqlite')
} : {
  url: "libsql://moneypot-website-adrienz.turso.io",
	authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEyLTI4VDAyOjA0OjAwLjE5MDgxNTMwNFoiLCJpZCI6IjkyZDAxYzQ5LWE1MjMtMTFlZS1iMWVkLTVlODdjMGQ1OTFkMCJ9.qG30_hunWI7uLhhsGQTkAtxvUpe2Yh0EOmNBzYrVupEVDx9b16JRgXv1EzvziOd6y8uF0_7_B-dbDPtAR_MHBQ",
  }

export default defineConfig({
  out: './server/database/migrations',
  schema: './server/database/schema.ts',
  driver: isDev ? "better-sqlite" : 'turso',
  dbCredentials: dbCredentials,
  verbose: true,
  strict: true,
})
