

import { oauthAccount } from "@moneypot/auth/schema"
import { eq, and } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

type DbType = BetterSQLite3Database | LibSQLDatabase

type OauthAccount = typeof oauthAccount
type OauthAccountInsert = typeof oauthAccount.$inferInsert
type OauthAccountSelect = typeof oauthAccount.$inferSelect

export class OauthAccountTable {
  private table: OauthAccount
  private db: DbType

  constructor(db: DbType, table: OauthAccount) {
    this.table = table
    this.db = db
  }

  async getByProviderData(providerData: { providedEmail?: string | null } & Pick<OauthAccountInsert, "providerID" | "providerUserID">) {
    if (!providerData) {
      return null
    }

    const users = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.providerID, providerData.providerID),
          eq(this.table.providerUserID, providerData.providerUserID),
        )
      )
      .limit(1)
      .execute();

    return users.at(0) ?? null;
  }
}