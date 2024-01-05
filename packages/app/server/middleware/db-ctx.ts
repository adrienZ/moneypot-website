import { ILuciaAuthNuxtAdaptater, oauthAccount, user, emailVerificationCode } from "@moneypot/auth/schema";
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
              // TODO: implement a second check if the oauthAccount email is already in user DB
              eq(oauthAccount.providerID, providerData.providerID),
              eq(oauthAccount.providerUserID, providerData.providerUserID),
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
      },
      async deleteEmailVerficationCode(userId) {
        await db
        .delete(emailVerificationCode)
        .where(eq(emailVerificationCode.userId, userId))
      },
      async insertEmailVerficationCode(data) {
        const [inserted] = await db
        .insert(emailVerificationCode)
        .values(data)
        .returning()

      return inserted;
      },
      async getEmailVerficationCodeByUserId(userId) {
        const [inserted] = await db
          .select()
          .from(emailVerificationCode)
          .where(eq(emailVerificationCode.userId, userId))
          .limit(1)
          .execute();

        return inserted;
      },
      async deleteEmailVerificationCodeById(code) {
        await db
          .delete(emailVerificationCode)
          .where(eq(emailVerificationCode.id, code))
          .execute();
      },
      async updateUserEmailVerificationById(id) {
          const [inserted] = await db
            .update(user)
            .set({
              emailVerified: true,
            })
            .where(eq(user.id, id))
            .returning();
          
            return inserted;

      },
    },
  }

  event.context.auth = auth;
});