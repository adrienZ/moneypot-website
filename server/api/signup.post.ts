import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { isValidEmail } from "#myauth/helpers/email";
import { encodeHex } from "oslo/encoding";
import { HMAC } from "oslo/crypto";

export default eventHandler(async (event) => {
  const formData = await readFormData(event);
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      message: "Invalid password",
      statusCode: 400
    });
  }

  const email = formData.get("email");
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return new Response("Invalid email", {
      status: 400
    });
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);
  const twoFactorSecret = await new HMAC("SHA-1").generateKey();

  try {
    const createdUser = await myAuth.userTable.insertUser({
      externalId: userId,
      password: hashedPassword,
      email,
      twoFactorSecret: encodeHex(twoFactorSecret)
    });

    await myAuth.hooks.onUserCreation(event, {
      email: createdUser.email,
      id: createdUser.id
    });
  } catch (e) {
    throw createError({
      message: "An unknown error occurred",
      statusCode: 500
    });
  }
});
