import { isWithinExpirationDate } from "oslo";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  const formData = await readBody(event);

  if (!sessionId) {
    throw createError({
      status: 401
    });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    throw createError({
      status: 401
    });
  }
  // const code = formData.get("code");
  const code = formData["code"];

  // check for length
  if (typeof code !== "string" || code.length !== 8) {
    throw new Response("invalid code", {
      status: 400
    });
  }

  const databaseCode =
    await myAuth.emailVerificationCodeTable.getEmailVerficationCodeByUserId(
      user.id
    );

  if (databaseCode) {
    await myAuth.emailVerificationCodeTable.deleteEmailVerficationCode(
      String(databaseCode.id)
    );
  }

  if (!databaseCode || databaseCode.code !== code) {
    throw new Response(null, {
      status: 400
    });
  }

  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    throw new Response(null, {
      status: 400
    });
  }

  // if (!user || user.email !== databaseCode.email) {
  // 	throw new Response(null, {
  // 		status: 400
  // 	});
  // }

  await lucia.invalidateUserSessions(user.id);

  const updatedUser = await myAuth.userTable.updateUserEmailVerificationById(
    Number(user.id)
  );

  myAuth.hooks.onUserLogin(event, {
    email: updatedUser.email,
    id: updatedUser.id
  });
});
