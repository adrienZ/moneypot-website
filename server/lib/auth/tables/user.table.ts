import { user } from "../../../database/schema";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type DbType = PostgresJsDatabase;

type UserTableType = typeof user;

export class UserTable {
  private table: UserTableType;
  private db: DbType;

  constructor(db: DbType, table: UserTableType) {
    this.table = table;
    this.db = db;
  }

  async getUserByEmail(email?: string) {
    if (!email) {
      return null;
    }

    const users = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.email, email))
      .limit(1)
      .execute();

    return users.at(0) ?? null;
  }
  async getUserByExternalId(uuid: string) {
    if (!uuid) {
      return null;
    }

    const users = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.externalId, uuid))
      .limit(1)
      .execute();

    return users.at(0) ?? null;
  }

  async insertUser(data: typeof user.$inferInsert) {
    const [inserted] = await this.db
      .insert(this.table)
      .values(data)
      .returning();

    return inserted;
  }

  async updateUserEmailVerificationById(id: number) {
    const [inserted] = await this.db
      .update(this.table)
      .set({
        emailVerified: true
      })
      .where(eq(this.table.id, id))
      .returning();

    return inserted;
  }

  async getTwoFactorSecretById(userId: number) {
    const user = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, userId));

    return user.at(0);
  }

  async updateUserTwoFactorEnabledById(userId: number) {
    return db
      .update(this.table)
      .set({
        twoFactorEnabled: true
      })
      .where(eq(this.table.id, userId))
      .returning();
  }
}
