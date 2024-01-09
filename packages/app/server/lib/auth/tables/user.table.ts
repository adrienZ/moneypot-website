import { user } from "../../../database/schema";
import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

type DbType = BetterSQLite3Database | LibSQLDatabase

type UserTableType = typeof user

export class UserTable {
  private table: UserTableType
  private db: DbType

  constructor(db: DbType, table: UserTableType) {
    this.table = table
    this.db = db
  }

  async getUserByEmail(email?: string) {
    if (!email) {
      return null
    }

    const users = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.email, email))
      .limit(1)
      .execute();

    return users.at(0) ?? null;
  }

  async insertUser(data: typeof user.$inferInsert) {
    const [inserted] = await this.db
      .insert(this.table)
      .values(data)
      .returning()

    return inserted;
  }

  async updateUserEmailVerificationById(id: number) {
    const [inserted] = await this.db
      .update(this.table)
      .set({
        emailVerified: true,
      })
      .where(eq(this.table.id, id))
      .returning();
    
      return inserted;
  }
}