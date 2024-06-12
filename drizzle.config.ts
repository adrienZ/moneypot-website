import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./server/database/migrations",
  schema: "./server/database/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  },
  verbose: true,
  strict: true
});
