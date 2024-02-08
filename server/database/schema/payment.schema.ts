import { date, varchar, pgTableCreator } from "drizzle-orm/pg-core";
import { creationColumns, primaryKeyColumn } from "./helpers/dbColumnHelpers";
import { user } from "./auth.schema";

const TABLE_PREFIX = "payment_layer_";
const pgTable = pgTableCreator((name) => `${TABLE_PREFIX}${name}`);

export const userLegalInformations = pgTable("user_legal_informations", {
  ...primaryKeyColumn,
  ...creationColumns,
  // we might need to create a table for names if we target asia
  // https://www.w3.org/International/questions/qa-personal-names
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  birthDate: date("birth_date", { mode: "date" }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => user.externalId)
});

// https://kitefaster.com/2017/05/03/maximum-string-length-popular-database-fields/
export const physicalAddress = pgTable("physical_address", {
  ...primaryKeyColumn,
  ...creationColumns,
  city: varchar("city", { length: 200 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  country: varchar("country", { length: 90 }).notNull(),
  streetLineOne: varchar("street_line_one", { length: 100 }).notNull(),
  streetLineTwo: varchar("street_line_two", { length: 100 }),
  phoneNumber: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => user.externalId)
});

const paymentProviders = ["stripe"] as const;
export const paymentAccount = pgTable("payment_account", {
  ...primaryKeyColumn,
  ...creationColumns,
  providerID: varchar("provider_id", {
    enum: paymentProviders,
    length: 25
  }).notNull(),
  providerUserID: varchar("provider_user_id", { length: 20 }).notNull(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => user.externalId)
});
