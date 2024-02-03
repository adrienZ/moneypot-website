import {
  text,
  boolean,
  timestamp,
  integer,
  varchar,
  serial,
  pgTableCreator
} from "drizzle-orm/pg-core";

const TABLE_PREFIX = "auth_layer_";
const sqliteTable = pgTableCreator((name) => `${TABLE_PREFIX}${name}`);

// user table
export const user = sqliteTable("user", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  username: text("username"),
  // password is optional because of oauth
  password: text("password"),
  emailVerified: boolean("email_verified").notNull().default(false),
  email: text("email").notNull().unique(),
  twoFactorSecret: varchar("two_factor_secret", { length: 128 }),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  avatar: varchar("avatar", { length: 512 }).default(
    "https://www.gravatar.com/avatar"
  )
});

export type User = typeof user.$inferSelect;

// user_session table
export const userSession = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("create_at").defaultNow(),
  os: varchar("os", { length: 100 })
});

export type UserSession = typeof userSession.$inferSelect;

const oauthProviders = ["github", "discord"] as const;
export const oauthAccount = sqliteTable("oauth_account", {
  id: serial("id").primaryKey(),
  providerID: text("provider_id", {
    enum: oauthProviders
  }).notNull(),
  providerUserID: text("provider_user_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id)
});

export const emailVerificationCode = sqliteTable("email_verification_code", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  userId: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  // date
  expiresAt: timestamp("expires_at").notNull()
});

export const passwordResetToken = sqliteTable("password_reset_token", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  // date
  expiresAt: timestamp("expires_at").notNull()
});

export const emailAudience = sqliteTable("email_audience", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  providerContactID: text("provider_contact_id").notNull(),
  date: timestamp("date").defaultNow()
});
