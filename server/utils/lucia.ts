// my db
import { user, userSession } from "../database/schema";
// lucia
import { Lucia } from "lucia";
// drizzle
import { drizzle } from "drizzle-orm/postgres-js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
// db clients
import postgres from "postgres";
import type { User, UserSession } from "../database/schema/types";

const isDev = process.env.NODE_ENV === "development";
const pgDatabase = postgres(process.env.DATABASE_URL as string, {
  prepare: false
});

export const db = drizzle(pgDatabase, { logger: false });

// @ts-expect-error lucia wants userSession id to be a string
const adapter = new DrizzlePostgreSQLAdapter(db, userSession, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !isDev,
      sameSite: "strict"
    }
  },
  getUserAttributes(attributes) {
    return {
      // TODO: fix types
      // @ts-expect-error
      externalId: attributes.externalId,
      // @ts-expect-error
      emailVerified: attributes.emailVerified,
      // @ts-expect-error
      twoFactorEnabled: attributes.twoFactorEnabled,
      // @ts-expect-error
      avatar: attributes.avatar
    };
  },
  getSessionAttributes(attributes) {
    return attributes;
  }
});

/**
 * LET'S TWEAK LUCIA'S MODULE TYPINGS
 */

interface ILuciaSession
  extends Pick<UserSession, "createdAt" | "userAgent" | "id" | "ip"> {}

interface ILuciaSessionRegister extends Pick<UserSession, "userAgent" | "ip"> {}

interface ILuciaUser
  extends Pick<
    User,
    "id" | "externalId" | "emailVerified" | "avatar" | "twoFactorEnabled"
  > {}
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: ILuciaSessionRegister;
  }
  interface DatabaseUserAttributes extends ILuciaUser {}

  interface DatabaseSessionAttributes extends ILuciaSession {}
}
