import { InferModel } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// user table
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull()
});

export type User = InferModel<typeof user>

// user_key table
export const userKey = sqliteTable('user_key', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  hashedPassword: text('hashed_password')
});
export type UserKey = InferModel<typeof userKey>

// user_session table
export const userSession = sqliteTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  activeExpires: integer('active_expires').notNull(),
  idleExpires: integer('idle_expires').notNull()
});
export type UserSession = InferModel<typeof userSession>
