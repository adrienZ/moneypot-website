// my db
import { user, userSession } from "../database/schema";
// lucia
import { Lucia } from "lucia";
// drizzle
import { drizzle } from "drizzle-orm/postgres-js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
// db clients
import postgres from "postgres";

const isDev = process.env.NODE_ENV === "development";
const pgDatabase = postgres(process.env.DATABASE_URL as string, {
  prepare: false
});

// https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle
export const db = drizzle(pgDatabase, { logger: false });

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
      avatar: attributes.avatar
    };
  },
  getSessionAttributes(attributes) {
    return attributes;
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: Pick<
      import("../database/schema").UserSession,
      "os"
    >;
  }
  interface DatabaseUserAttributes
    extends Pick<
      import("../database/schema").User,
      "id" | "externalId" | "emailVerified" | "avatar"
    > {}

  interface DatabaseSessionAttributes
    extends Pick<import("../database/schema").UserSession, "createdAt"> {}
}
