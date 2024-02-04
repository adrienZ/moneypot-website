import { Argon2id } from "oslo/password";
import { LoginThrottlingService } from "#myauth/services/loginThrottlingService";
import { z } from "zod";

const formDataSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6).max(255)
});

export default eventHandler(async (event) => {
  const form = formDataSchema.safeParse(await readFormData(event));

  if (!form.success) {
    const firstError = form.error.errors[0];
    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const { password, email } = form.data;

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
