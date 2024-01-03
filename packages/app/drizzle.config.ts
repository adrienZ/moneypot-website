import { join } from 'pathe'
import { defineConfig } from 'drizzle-kit'

const driver:"better-sqlite" | "turso" = "better-sqlite";
const isDev = driver === "better-sqlite"
const dbCredentials = isDev ? {
  url: join(__dirname, './db.sqlite')
} : {
    url: process.env.TURSO_DB_URL,
    authToken:process.env.TURSO_DB_TOKEN,
  }

export default defineConfig({
  out: './server/database/migrations',
  schema: './server/database/schema.ts',
  driver: isDev ? "better-sqlite" : 'turso',
  dbCredentials: dbCredentials,
  verbose: true,
  strict: true,
})
