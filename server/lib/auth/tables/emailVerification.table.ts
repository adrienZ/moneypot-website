import { emailVerificationCode } from "../../../database/schema";
import { eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

type DbType = BetterSQLite3Database | LibSQLDatabase;

type EmailVerificationCodeTableType = typeof emailVerificationCode;

export class EmailVerificationCodeTable {
  private table: EmailVerificationCodeTableType;
  private db: DbType;

  constructor(db: DbType, table: EmailVerificationCodeTableType) {
    this.table = table;
    this.db = db;
  }

  async deleteEmailVerficationCode(userId: string) {
    await this.db.delete(this.table).where(eq(this.table.userId, userId));
  }

  async insertEmailVerficationCode(
    data: typeof emailVerificationCode.$inferInsert
  ) {
    const [inserted] = await db.insert(this.table).values(data).returning();

    return inserted;
  }

  async getEmailVerficationCodeByUserId(userId: string) {
    const [inserted] = await db
      .select()
      .from(this.table)
      .where(eq(this.table.userId, userId))
      .limit(1)
      .execute();

    return inserted;
  }

  async deleteEmailVerificationCodeById(code: number) {
    await db.delete(this.table).where(eq(this.table.id, code)).execute();
  }
}
