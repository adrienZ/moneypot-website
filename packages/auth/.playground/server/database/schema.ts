import { InferModel } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// user table
export const user = sqliteTable('user', {
  // id VARCHAR(15) PRIMARY KEY,
  id: text('id').primaryKey(),
  // username VARCHAR(31) NOT NULL UNIQUE
  username: text('username').notNull(),
  // email VARCHAR(31) NOT NULL UNIQUE,
  email: text("email").notNull().unique().default("test@test.com"),
  // email_verified INTEGER NOT NULL
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false)
});

export type User = InferModel<typeof user>

// user_key table
export const userKey = sqliteTable('user_key', {
  // id VARCHAR(255) PRIMARY KEY,
  id: text('id').primaryKey(),
  // user_id VARCHAR(15) NOT NULL,
  // FOREIGN KEY (user_id) REFERENCES user(id)
  userId: text('user_id').notNull().references(() => user.id),
  // hashed_password VARCHAR(255),
  hashedPassword: text('hashed_password')
});
export type UserKey = InferModel<typeof userKey>

// user_session table
export const userSession = sqliteTable('user_session', {
  // id VARCHAR(127) PRIMARY KEY,
  id: text('id').primaryKey(),
  // user_id VARCHAR(15) NOT NULL,
  // FOREIGN KEY (user_id) REFERENCES user(id)
  userId: text('user_id').notNull().references(() => user.id),
  // active_expires BIGINT NOT NULL,
  activeExpires: integer('active_expires').notNull(),
  // idle_expires BIGINT NOT NULL,
  idleExpires: integer('idle_expires').notNull()
});
export type UserSession = InferModel<typeof userSession>

// export const emailVerificationToken = sqliteTable("email_verification_token", {
//   // id VARCHAR(63) PRIMARY KEY,
//   id: text('id').primaryKey(),
//   // user_id VARCHAR(15) NOT NULL,
//   userId: text('user_id').notNull(),
//   // expires BIGINT NOT NULL
//   expites: integer("expires").notNull()
// })

// export type EmailVerificationToken = InferModel<typeof emailVerificationToken>;

// export const passwordResetToken = sqliteTable('password_reset_token', {
//   // id VARCHAR(63) PRIMARY KEY,
//   id: text('id').primaryKey(),
//   // user_id VARCHAR(15) NOT NULL,
//   userId: text('user_id').notNull(),
//   // expires BIGINT NOT NULL
//   expites: integer("expires").notNull()
// })