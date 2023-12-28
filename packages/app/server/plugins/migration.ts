import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default defineNitroPlugin(async () => {
  if (process.dev) {
    migrate(db, { migrationsFolder: resolve(fileURLToPath(import.meta.url), "../../../", "./server/database/migrations") });
  }
})