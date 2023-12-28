import { ILuciaAuthNuxtAdaptater, user } from "@moneypot/auth/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const auth: ILuciaAuthNuxtAdaptater = {
    lucia,
    databaseQueries: {
      async insertUser(data) {
        await db
          .insert(user)
          .values(data)
          .execute();
      },
      async getUser(username: string) {
        const [ existingUser ] = await db
        .select()
        .from(user)
        .where(eq(user.username, username))
        .limit(1)
        .execute();

        return existingUser ?? null
      }
    }
  }


  event.context.auth = auth;
});