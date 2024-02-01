import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { drizzle as drizzleBetterSqlite3 } from "drizzle-orm/better-sqlite3";
import sqlite from "better-sqlite3";
import { TABLE_PREFIX } from "../database/schema";
import { drizzle as drizzleLibSQL } from "drizzle-orm/libsql";
import { createClient as createLibSQLClient } from "@libsql/client";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";

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

const adapterLibSql = new LibSQLAdapter(tursoDatabase, {
  user: `${TABLE_PREFIX}user`,
  session: `${TABLE_PREFIX}user_session`
});

// supabase postgres: https://supabase.com/docs/guides/auth/social-login

const adapterBetterSql = new BetterSqlite3Adapter(sqliteDatabase, {
  user: `${TABLE_PREFIX}user`,
  session: `${TABLE_PREFIX}user_session`
});

export const lucia = new Lucia(isDev ? adapterBetterSql : adapterLibSql, {
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
      emailVerified: Boolean(attributes.email_verified)
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
      "id" | "externalId" | "emailVerified"
    > {}
}
