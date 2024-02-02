// my db
import { user, userSession } from "../database/schema";
// lucia
import { Lucia } from "lucia";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
// drizzle
import { drizzle as drizzleBetterSqlite3 } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibSQL } from "drizzle-orm/libsql";
// db clients
import { createClient as createLibSQLClient } from "@libsql/client";
import sqlite from "better-sqlite3";

// const __filename = url.fileURLToPath(import.meta.url);
// const dbFolder = resolve(dirname(__filename), "../../");
const isDev = process.env.NODE_ENV === "development";

const sqliteDatabase = sqlite(":memory:");
// const sqliteDatabase = sqlite(join(dbFolder, './db.sqlite'));
// export const db: BetterSQLite3Database = drizzle(sqliteDatabase, { logger: true });
const tursoDatabase = createLibSQLClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_TOKEN
});

export const db = isDev
  ? drizzleBetterSqlite3(sqliteDatabase, { logger: true })
  : drizzleLibSQL(tursoDatabase, { logger: true });

// supabase postgres: https://supabase.com/docs/guides/auth/social-login

const adapter = new DrizzleMySQLAdapter(db, userSession, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !isDev,
      sameSite: "strict"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      // @ts-expect-error
      externalId: attributes.external_id,
      // @ts-expect-error
      // cast boolean because sqlite returns number
      emailVerified: Boolean(attributes.email_verified),
      avatar: attributes.avatar
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes
    extends Pick<
      import("../database/schema").User,
      "id" | "externalId" | "emailVerified" | "avatar"
    > {}
}
