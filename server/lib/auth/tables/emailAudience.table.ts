import type { emailAudience } from "../../../database/schema";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

type DbType = BetterSQLite3Database | LibSQLDatabase;

type TableType = typeof emailAudience;
type InsertType = typeof emailAudience.$inferInsert;
type SelectType = typeof emailAudience.$inferSelect;

export class EmailAudienceTable {
  private table: TableType;
  private db: DbType;

  constructor(db: DbType, table: TableType) {
    this.table = table;
    this.db = db;
  }

  async insert(values: InsertType): Promise<SelectType> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(values)
      .returning();

    return inserted;
  }
}
