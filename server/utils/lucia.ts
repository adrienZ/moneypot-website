// my db
import { user, userSession } from "../database/schema";
// lucia
import { Lucia } from "lucia";
// drizzle
import { drizzle } from "drizzle-orm/node-postgres";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
// db clients
import { Pool } from "pg";

const isDev = process.env.NODE_ENV === "development";
const pgDatabase = new Pool({
  connectionString: process.env.BASE_URL as string
});

export const db = drizzle(pgDatabase, { logger: true });

const adapter = new DrizzlePostgreSQLAdapter(db, userSession, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !isDev,
      sameSite: "strict"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      // TODO: fix types
      // @ts-expect-error
      externalId: attributes.externalId,
      // @ts-expect-error
      emailVerified: attributes.emailVerified,
      // @ts-expect-error
      avatar: attributes.avatar
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes
    extends Pick<
      import("../database/schema").User,
      "id" | "externalId" | "emailVerified" | "avatar"
    > {}
}
