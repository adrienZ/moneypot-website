import { isValidEmail } from "#myauth/helpers/email";
import { createPasswordResetToken } from "#myauth/reset-password";
import { user } from "../../database/schema";
import { eq } from "drizzle-orm";
import { createError } from "h3";

// TODO: Make sure to implement rate limiting based on IP addresses.
export default defineEventHandler(async (event) => {
  const { email } = await readBody<{
    email: unknown;
  }>(event);
  // basic check
  if (typeof email === "string" && !isValidEmail(email)) {
    throw createError({ status: 400, message: "Invalid email" });
  }

  const [storedUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email as string))
    .limit(1);

  if (!storedUser || !storedUser.emailVerified) {
    return new Response("Invalid email", {
      status: 400
    });
  }

  const verificationToken = await createPasswordResetToken(storedUser.id);
  const verificationLink =
    process.env.BASE_URL + "/reset-password/" + verificationToken;

  myAuth.emailService.sendResetPasswordRequest({
    targetEmail: storedUser.email,
    url: verificationLink
  });

  return new Response(null, {
    status: 200
  });
});
