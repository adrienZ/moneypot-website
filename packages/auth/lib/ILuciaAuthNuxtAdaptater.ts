import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { RegisteredLucia, User } from "lucia";
import { user } from "../schema";

type DrizzleDatabase = BetterSQLite3Database | LibSQLDatabase

type UserInsert = typeof user.$inferInsert
type UserSelect= typeof user.$inferSelect

interface IDatabaseQueries {
  insertUser(user: UserInsert): Promise<void>
  getUser(username: string): Promise<UserSelect | null>
}

export interface ILuciaAuthNuxtAdaptater {
  lucia: RegisteredLucia
  databaseQueries: IDatabaseQueries
}