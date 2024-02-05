import { passwordResetToken, user } from "../../database/schema";
import { isWithinExpirationDate } from "oslo";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { createError } from "h3";

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
    throw new Response("token is missing", {
      status: 400
    });
  }

  if (!isWithinExpirationDate(token.expiresAt)) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, token.token));
    throw new Response("invalid token", {
      status: 400
    });
  }

  const connectedUser =
    event.context.user ??
    (await db.select().from(user).where(eq(user.id, token.userId)).limit(1)).at(
      0
    );

  if (!connectedUser) {
    throw createError({
      status: 403
    });
  }

  await lucia.invalidateUserSessions(String(connectedUser.id));
  const hashedPassword = await new Argon2id().hash(password);

  await db
    .update(user)
    .set({
      password: hashedPassword
    })
    .where(eq(user.id, Number(connectedUser.id)));

  const ua = getRequestHeader(event, "User-Agent");
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? null;

  const session = await lucia.createSession(String(connectedUser.id), {
    // varchar(500)
    userAgent: ua?.substring(0, 500) ?? null,
    ip
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize()
    }
  });
});
