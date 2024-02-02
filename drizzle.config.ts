import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./server/database/migrations",
  schema: "./server/database/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.BASE_URL as string
  },
  verbose: true,
  strict: false
});
