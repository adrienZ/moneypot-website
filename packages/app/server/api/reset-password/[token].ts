import { passwordResetToken, user } from "../../database/schema";
import { isWithinExpirationDate } from "oslo";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

export default defineEventHandler(async (event) => {
  const { password } = await readBody<{
    password: unknown;
  }>(event);
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({ status: 400, message: "Invalid password" });
  }
  const { token: verificationToken } = event.context.params ?? {
    token: ""
  };

  const token = (
    await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, verificationToken))
      .limit(1)
  ).at(0);

  if (token) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, verificationToken));
  }

  if (!token) {
    return new Response("token is missing", {
      status: 400
    });
  }

  if (!isWithinExpirationDate(token.expiresAt)) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, token.token));
    return new Response("invalid token", {
      status: 400
    });
  }

  let connectedUser = event.context.user;
  if (!connectedUser) {
    const userFromDb = (
      await db.select().from(user).where(eq(user.id, token.userId)).limit(1)
    ).at(0);
    connectedUser = userFromDb;
  }

  await lucia.invalidateUserSessions(String(connectedUser.id));
  const hashedPassword = await new Argon2id().hash(password);

  console.log({ hashedPassword });

  await db
    .update(user)
    .set({
      password: hashedPassword
    })
    .where(eq(user.id, connectedUser.id));

  console.log("UPDATED");

  const session = await lucia.createSession(connectedUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize()
    }
  });

  return {};
});
