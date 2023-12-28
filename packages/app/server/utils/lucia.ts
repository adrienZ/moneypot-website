import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { join, dirname, resolve } from 'pathe'
import sqlite from "better-sqlite3";
import url from 'node:url'
import { TABLE_PREFIX, user } from "@moneypot/auth/schema";
import { drizzle as drizzleLibSQL, LibSQLDatabase } from 'drizzle-orm/libsql'
import { createClient as createLibSQLClient } from '@libsql/client';

const __filename = url.fileURLToPath(import.meta.url);
const dbFolder = resolve(dirname(__filename), "../../");

// const sqliteDatabase = sqlite(":memory:");
const sqliteDatabase = sqlite('./db.sqlite');
let db = drizzleLibSQL(createLibSQLClient({
	url: "libsql://moneypot-website-adrienz.turso.io",
	authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEyLTI4VDAyOjA0OjAwLjE5MDgxNTMwNFoiLCJpZCI6IjkyZDAxYzQ5LWE1MjMtMTFlZS1iMWVkLTVlODdjMGQ1OTFkMCJ9.qG30_hunWI7uLhhsGQTkAtxvUpe2Yh0EOmNBzYrVupEVDx9b16JRgXv1EzvziOd6y8uF0_7_B-dbDPtAR_MHBQ",
}))

// if (process.dev) {
// 	db = drizzle(sqliteDatabase) as BetterSQLite3Database;
// }

export  {db }


const adapter = new BetterSqlite3Adapter(sqliteDatabase, {
	user: `${TABLE_PREFIX}user`,
	session: `${TABLE_PREFIX}user_session`,
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !import.meta.dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			// githubId: attributes.githubId
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
	interface DatabaseUserAttributes extends Omit<import("../database/schema").User, "id"> {}
}
