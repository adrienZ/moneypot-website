import { text, integer, sqliteTableCreator } from 'drizzle-orm/sqlite-core';
import { TABLE_PREFIX } from './lib/constants';

const sqliteTable = sqliteTableCreator(name => `${TABLE_PREFIX}${name}`)


// user table
export const user = sqliteTable('user', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  externalId: text('external_id').notNull().unique(),
  username: text('username'),
  // password is optional because of oauth
  password: text("password"),
  emailVerified: integer("email_verified", {mode: "boolean"}).notNull().default(false),
  email: text("email").notNull().unique()
});

export type User = typeof user.$inferSelect;

// user_session table
export const userSession = sqliteTable('user_session', {
  id: text('id').notNull().primaryKey(),
  userId: integer('user_id').notNull().references(() => user.id),
  expiresAt: integer("expires_at", { mode: "timestamp"}).notNull()
});

const oauthProviders = [ "github", "discord" ] as const;
export const oauthAccount = sqliteTable("oauth_account", {
  id: integer('id'). notNull().primaryKey({ autoIncrement: true }),
  providerID: text("provider_id", {
    enum: oauthProviders
  }).notNull(),
  providerUserID: text("provider_user_id").notNull(),
  // TODO: use `id` instead of `externalId`
  userId: text('user_id').notNull().references(() => user.externalId),
})

export const emailVerificationCode = sqliteTable("email_verification_code", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  userId: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  // date
  expiresAt: integer("expires_at", { mode: "timestamp"}).notNull()
});

export const passwordResetToken = sqliteTable("password_reset_token", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  token: text("token").notNull(),
  userId: integer('user_id').notNull().references(() => user.id),
  // date
  expiresAt: integer("expires_at", { mode: "timestamp"}).notNull()
})

export { TABLE_PREFIX }
export type { ILuciaAuthNuxtAdaptater } from "./lib/ILuciaAuthNuxtAdaptater"