import { text, integer, sqliteTableCreator } from 'drizzle-orm/sqlite-core';
import { TABLE_PREFIX } from './lib/constants';

const sqliteTable = sqliteTableCreator(name => `${TABLE_PREFIX}${name}`)


// user table
export const user = sqliteTable('user', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  externalId: text('external_id').notNull().unique(),
  username: text('username').notNull(),
  // password is optional because of oauth
  password: text("password")
});

export type User = typeof user.$inferSelect;

// user_session table
export const userSession = sqliteTable('user_session', {
  id: text('id').notNull().primaryKey(),
  // TODO: looks i have no choice but use the column "id" in lucia
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
  userId: text('user_id').notNull().references(() => user.externalId),
})

export { TABLE_PREFIX }
export type { ILuciaAuthNuxtAdaptater } from "./lib/ILuciaAuthNuxtAdaptater"