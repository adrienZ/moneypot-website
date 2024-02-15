import { varchar, pgTableCreator, text, integer } from "drizzle-orm/pg-core";
import { creationColumns, primaryKeyColumn } from "./helpers/dbColumnHelpers";

import { user } from "./auth.schema";

const TABLE_PREFIX = "moneypot_website_";
const pgTable = pgTableCreator((name) => `${TABLE_PREFIX}${name}`);

export const moneypotCategory = pgTable("moneypot_category", {
  ...primaryKeyColumn,
  ...creationColumns,
  externalId: varchar("external_id", { length: 10 }).notNull().unique(),
  value: varchar("value", { length: 100 }).notNull().unique(),
  image: varchar("image", { length: 255 }).notNull()
});

export const moneypot = pgTable("moneypot", {
  ...primaryKeyColumn,
  ...creationColumns,
  externalId: varchar("external_id", { length: 15 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  creatorId: varchar("creator_id", { length: 15 })
    .notNull()
    .references(() => user.externalId),
  categoryId: varchar("category_id", { length: 10 })
    .notNull()
    .references(() => moneypotCategory.externalId),
  // https://www.iso.org/iso-4217-currency-codes.html
  currency: varchar("currency", { length: 3 }).notNull().default("EUR"),
  targetAmount: integer("target_amount")
});
