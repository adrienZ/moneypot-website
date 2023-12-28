import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { join, dirname, resolve } from 'pathe'
import sqlite from "better-sqlite3";
import url from 'node:url'
import { TABLE_PREFIX, user } from "@moneypot/auth/schema";
import { drizzle as drizzleLibSQL, LibSQLDatabase } from 'drizzle-orm/libsql'
import { createClient as createLibSQLClient } from '@libsql/client';
// import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";

// const __filename = url.fileURLToPath(import.meta.url);
// const dbFolder = resolve(dirname(__filename), "../../");
const isDev = process.env.NODE_ENV === "development";


const sqliteDatabase = sqlite(":memory:");
// const sqliteDatabase = sqlite(join(dbFolder, './db.sqlite'));
// export const db: BetterSQLite3Database = drizzle(sqliteDatabase, { logger: true });
const tursoDatabase = createLibSQLClient({
	url: "libsql://moneypot-website-adrienz.turso.io",
	authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEyLTI4VDAyOjA0OjAwLjE5MDgxNTMwNFoiLCJpZCI6IjkyZDAxYzQ5LWE1MjMtMTFlZS1iMWVkLTVlODdjMGQ1OTFkMCJ9.qG30_hunWI7uLhhsGQTkAtxvUpe2Yh0EOmNBzYrVupEVDx9b16JRgXv1EzvziOd6y8uF0_7_B-dbDPtAR_MHBQ",
});

export const db = isDev 
	? drizzle(sqliteDatabase, { logger: true })
	: drizzleLibSQL(tursoDatabase, { logger: true })

const adapterLibSql = new LibSQLAdapter(tursoDatabase, {
	user: `${TABLE_PREFIX}user`,
	session: `${TABLE_PREFIX}user_session`,
});

const adapterBetterSql = new BetterSqlite3Adapter(sqliteDatabase, {
	user: `${TABLE_PREFIX}user`,
	session: `${TABLE_PREFIX}user_session`,
});



export const lucia = new Lucia(isDev ? adapterBetterSql : adapterLibSql, {
	sessionCookie: {
		attributes: {
			secure: !isDev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			// @ts-expect-error
			externalId: attributes.external_id
		}
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
	interface DatabaseUserAttributes extends Pick<import("../database/schema").User, "id" | "externalId" | "username"> {}
}
