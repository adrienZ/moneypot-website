import type { emailAudience } from "../../../database/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type DbType = PostgresJsDatabase;

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
