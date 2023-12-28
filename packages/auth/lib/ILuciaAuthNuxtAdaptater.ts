import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { Lucia, RegisteredLucia, User } from "lucia";
import { user, oauthAccount } from "../schema";

type DrizzleDatabase = BetterSQLite3Database | LibSQLDatabase

type UserInsert = typeof user.$inferInsert
type UserSelect= typeof user.$inferSelect

type OauthAccountInsert = typeof oauthAccount.$inferInsert
type OauthAccountSelect = typeof oauthAccount.$inferSelect


interface IDatabaseQueries {
  insertUser(user: UserInsert): Promise<UserSelect>
  insertOauthAccount(account: OauthAccountInsert): Promise<OauthAccountSelect>
  getUser(id?: string, providerData?: Pick<OauthAccountInsert, "providerID" | "providerUserID">): Promise<UserSelect | null>}


type UserWithoutId = Omit<UserSelect, "id">
export interface ILuciaAuthNuxtAdaptater {
  lucia: Lucia<UserWithoutId, UserWithoutId>
  databaseQueries: IDatabaseQueries
}