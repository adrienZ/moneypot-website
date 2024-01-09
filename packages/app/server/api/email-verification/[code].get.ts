import { isWithinExpirationDate } from "oslo";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  // const formData = await readFormData(event);
  const formData = await getRouterParams(event);

  if (!sessionId) {
    return createError({
      status: 401
    });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    return createError({
      status: 401
    });
  }
  // const code = formData.get("code");
  const code = formData["code"];

  // check for length
  if (typeof code !== "string" || code.length !== 8) {
    return new Response("invalid code", {
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
    return new Response(null, {
      status: 400
    });
  }

  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    return new Response(null, {
      status: 400
    });
  }

  // if (!user || user.email !== databaseCode.email) {
  // 	return new Response(null, {
  // 		status: 400
  // 	});
  // }

  await lucia.invalidateUserSessions(user.id);

  const updatedUser = await myAuth.userTable.updateUserEmailVerificationById(
    user.id
  );

  myAuth.hooks.onUserLogin(event, {
    email: updatedUser.email,
    id: updatedUser.id
  });
});
