import { join } from 'pathe'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './server/database/migrations',
  schema: './server/database/schema.ts',
  driver: '',
  dbCredentials: {
    url: join(__dirname, './db.sqlite')
  },
  verbose: true,
  strict: true,
})
