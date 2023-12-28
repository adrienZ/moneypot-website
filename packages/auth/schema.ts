import { InferModel } from 'drizzle-orm';
import { sqliteTableCreator, text, integer } from 'drizzle-orm/sqlite-core'
import { TABLE_PREFIX } from './lib/constants';

const sqliteTable = sqliteTableCreator(name => `${TABLE_PREFIX}${name}`)


// user table
export const user = sqliteTable('user', {
  // id VARCHAR(15) PRIMARY KEY,
  id: text('id').primaryKey(),
  // username VARCHAR(31) NOT NULL UNIQUE
  username: text('username').notNull(),

  // github_id INTEGER NOT NULL UNIQUE,
  githubId: integer("github_id"),
  // password is optional because of oauth
  password: text("password")
  // email VARCHAR(31) NOT NULL UNIQUE,
  // email: text("email").notNull().unique().default("test@test.com"),
  // email_verified INTEGER NOT NULL
  // emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false)
});

export type User = InferModel<typeof user>

// user_session table
export const userSession = sqliteTable('user_session', {
  // id VARCHAR(127) PRIMARY KEY,
  id: text('id').notNull().primaryKey(),
  // user_id VARCHAR(15) NOT NULL,
  // FOREIGN KEY (user_id) REFERENCES user(id)
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: integer("expires_at", { mode: "timestamp"}).notNull()
});
export type UserSession = InferModel<typeof userSession>

export { TABLE_PREFIX }