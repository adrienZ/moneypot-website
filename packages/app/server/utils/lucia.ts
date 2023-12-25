import { lucia } from "lucia";
import { github } from "@lucia-auth/oauth/providers";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { h3 } from "lucia/middleware";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { join } from 'pathe'
import sqlite from "better-sqlite3";


const sqliteDatabase = sqlite(join(process.cwd(), './db.sqlite'));
export const db: BetterSQLite3Database = drizzle(sqliteDatabase);

export const auth = lucia({
	adapter: betterSqlite3(sqliteDatabase, {
		user: "user",
		session: "user_session",
		key: "user_key"
	}),
	middleware: h3(),
	env: process.dev ? "DEV" : "PROD",
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

const runtimeConfig = useRuntimeConfig();
export const githubAuth = github(auth, {
	clientId: runtimeConfig.githubClientId,
	clientSecret: runtimeConfig.githubClientSecret,
	scope: ["user:email"]
});

export type Auth = typeof auth;