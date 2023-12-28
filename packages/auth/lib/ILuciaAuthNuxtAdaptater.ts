// import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
// import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { Lucia } from "lucia";

// TODO: find a way to externalise those imports
import { user, oauthAccount } from "../schema";

type UserInsert = typeof user.$inferInsert
type UserSelect= typeof user.$inferSelect

type OauthAccountInsert = typeof oauthAccount.$inferInsert
type OauthAccountSelect = typeof oauthAccount.$inferSelect


// TODO: create a "defineFunction" instead of interface
interface IDatabaseQueries {
  insertUser(user: UserInsert): Promise<UserSelect>
  insertOauthAccount(account: OauthAccountInsert): Promise<OauthAccountSelect>
  getUser(id?: string, providerData?: Pick<OauthAccountInsert, "providerID" | "providerUserID">): Promise<UserSelect | null>}


type UserWithoutId = Omit<UserSelect, "id">
export interface ILuciaAuthNuxtAdaptater {
  lucia: Lucia<UserWithoutId, UserWithoutId>
  databaseQueries: IDatabaseQueries
}