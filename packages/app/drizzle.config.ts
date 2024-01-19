import { join } from "pathe";
import { defineConfig } from "drizzle-kit";

const driver: "better-sqlite" | "turso" = "better-sqlite";
const isDev = driver === "better-sqlite";

const betterSqLiteDbCredentials = {
  url: join(__dirname, "./db.sqlite")
};

const tursoDbCredentials = {
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_TOKEN
};

const dbCredentials = isDev ? betterSqLiteDbCredentials : tursoDbCredentials;

export default defineConfig({
  out: "./server/database/migrations",
  schema: "./server/database/schema.ts",
  driver: isDev ? "better-sqlite" : "turso",
  dbCredentials: dbCredentials,
  verbose: true,
  strict: true
});
