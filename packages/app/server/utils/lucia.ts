import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { join, dirname, resolve } from 'pathe'
import sqlite from "better-sqlite3";
import url from 'node:url'
import { TABLE_PREFIX } from "@moneypot/auth/schema";

const __filename = url.fileURLToPath(import.meta.url);
const dbFolder = resolve(dirname(__filename), "../../");

const sqliteDatabase = sqlite(join(dbFolder, './db.sqlite'));
export const db = drizzle(sqliteDatabase);


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
