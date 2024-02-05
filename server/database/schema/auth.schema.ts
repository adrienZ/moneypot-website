import {
  text,
  boolean,
  timestamp,
  integer,
  varchar,
  pgTableCreator
} from "drizzle-orm/pg-core";
import { creationColumns, primaryKeyColumn } from "./helpers/dbColumnHelpers";

const TABLE_PREFIX = "auth_layer_";
const sqliteTable = pgTableCreator((name) => `${TABLE_PREFIX}${name}`);

export const user = sqliteTable("user", {
  ...primaryKeyColumn,
  ...creationColumns,
  externalId: text("external_id").notNull().unique(),
  username: text("username"),
  // password is optional because of oauth
  password: text("password"),
  emailVerified: boolean("email_verified").notNull().default(false),
  email: text("email").notNull().unique(),
  twoFactorSecret: varchar("two_factor_secret", { length: 128 }),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  avatar: varchar("avatar", { length: 512 })
    .notNull()
    .default("https://www.gravatar.com/avatar")
});

export const userSession = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  ...creationColumns,
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: varchar("user_agent", { length: 500 }),
  ip: varchar("ip", { length: 45 })
});

const oauthProviders = ["github", "discord"] as const;
export const oauthAccount = sqliteTable("oauth_account", {
  ...primaryKeyColumn,
  ...creationColumns,
  providerID: text("provider_id", {
    enum: oauthProviders
  }).notNull(),
  providerUserID: text("provider_user_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id)
});

export const emailVerificationCode = sqliteTable("email_verification_code", {
  ...primaryKeyColumn,
  ...creationColumns,
  code: text("code").notNull(),
  userId: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull()
});

export const passwordResetToken = sqliteTable("password_reset_token", {
  ...primaryKeyColumn,
  ...creationColumns,
  token: text("token").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at").notNull()
});

export const emailAudience = sqliteTable("email_audience", {
  ...primaryKeyColumn,
  ...creationColumns,
  email: text("email").notNull(),
  providerContactID: text("provider_contact_id").notNull()
});
