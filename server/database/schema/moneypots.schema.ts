import { varchar, serial, pgTableCreator } from "drizzle-orm/pg-core";

const TABLE_PREFIX = "moneypot_website_";
const sqliteTable = pgTableCreator((name) => `${TABLE_PREFIX}${name}`);

export const moneypotCategory = sqliteTable("moneypot_category", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 10 }).notNull().unique(),
  value: varchar("value", { length: 100 }).unique(),
  image: varchar("image", { length: 255 })
});
