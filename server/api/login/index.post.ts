import { Argon2id } from "oslo/password";
import { LoginThrottlingService } from "#myauth/services/loginThrottlingService";
// import { LegacyScrypt } from "lucia"

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
  if (!email || typeof email !== "string") {
    throw createError({
      message: "Invalid email",
      statusCode: 400
    });
  }

  await LoginThrottlingService.getInstance().run(event, email);

  const existingUser = await myAuth.userTable.getUserByEmail(email);

  if (!existingUser) {
    throw createError({
      message: "email not found in db ",
      statusCode: 400
    });
  }

  if (!existingUser.password) {
    throw createError({
      message: "missing data in user",
      statusCode: 500
    });
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password
  );

  if (!validPassword) {
    throw createError({
      message: "Incorrect email or password",
      statusCode: 400
    });
  }

  if (!existingUser.twoFactorEnabled) {
    await myAuth.hooks.onUserLogin(event, {
      email: existingUser.email,
      id: existingUser.id
    });
  }

  return {
    redirect: existingUser.twoFactorEnabled
      ? "/auth/login-2fa/" + existingUser.externalId
      : "/"
  };
});
