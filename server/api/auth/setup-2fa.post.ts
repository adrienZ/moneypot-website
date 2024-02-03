import { createError } from "h3";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  const formData = await readBody(event);

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

  const existingUser = await myAuth.userTable.getTwoFactorSecretById(user.id);
  if (!existingUser) {
    throw createError({
      message: "user not found",
      statusCode: 400
    });
  }

  const { twoFactorSecret } = existingUser;
  if (!twoFactorSecret) {
    throw createError({
      message: "secret not found",
      statusCode: 400
    });
  }

  const otp = formData["code"];

  // check for length
  if (typeof otp !== "string" || otp.length !== 6) {
    return new Response("invalid code", {
      status: 400
    });
  }

  const validOTP = await new TOTPController().verify(
    otp,
    decodeHex(twoFactorSecret)
  );

  if (validOTP) {
    await myAuth.userTable.updateUserTwoFactorEnabledById(user.id);
  } else {
    throw createError({
      message: "code not valid",
      statusCode: 400
    });
  }

  return {
    validOTP
  };
});
