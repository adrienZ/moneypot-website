import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const userId = body.userId;
  if (!userId) {
    throw createError({
      message: "Missing Data",
      statusCode: 400
    });
  }

  const existingUser = await myAuth.userTable.getUserByExternalId(userId);
  if (!existingUser) {
    throw createError({
      message: "user not found",
      statusCode: 400
    });
  }

  const otp = body.code;
  if (typeof otp !== "string" || otp.length !== 6) {
    return new Response("invalid code", {
      status: 400
    });
  }

  const { twoFactorSecret } = existingUser;
  if (!twoFactorSecret) {
    throw createError({
      message: "secret not found",
      statusCode: 400
    });
  }

  const validOTP = await new TOTPController().verify(
    otp,
    decodeHex(twoFactorSecret)
  );

  if (validOTP) {
    await myAuth.hooks.onUserLogin(event, {
      email: existingUser.email,
      id: existingUser.id
    });
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
