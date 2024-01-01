import { ILuciaAuthNuxtAdaptater, oauthAccount, user } from "@moneypot/auth/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const auth: ILuciaAuthNuxtAdaptater = {
    lucia,
    databaseQueries: {
      async insertUser(data) {
        const [inserted] = await db
          .insert(user)
          .values(data)
          .returning()

        return inserted;
      },
      async getUser(email, providerData) {
        console.log(email, providerData);
        

        if (email) {
          const [ existingUser ] = await db
          .select()
          .from(user)
          .where(eq(user.email, email))
          .limit(1)
          .execute();

          return existingUser
        }

        if (providerData) {
          const [ existingUser ] = await db
          .select()
          .from(oauthAccount)
          .where(
            and(
              eq(oauthAccount.providerID, providerData.providerID),
              eq(oauthAccount.providerUserID, providerData.providerUserID)
            )
          )
          .limit(1)
          .execute();
          
          return existingUser
        }

        return null
      },
      async insertOauthAccount(account) {
        const [inserted] = await db
          .insert(oauthAccount)
          .values(account)
          .returning()

        return inserted
      }
    }
  }

  event.context.auth = auth;
});