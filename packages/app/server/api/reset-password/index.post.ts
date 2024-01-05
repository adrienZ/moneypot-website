import { isValidEmail } from "~/server/lib/helpers/email";
import { user } from "@moneypot/auth/schema";
import { eq } from "drizzle-orm";
import { createPasswordResetToken } from "~/server/lib/reset-password"

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
    const verificationLink = "http://localhost:3000/reset-password/" + verificationToken;

    useEmailService(event).sendEmailVerification({
      targetEmail: storedUser.email,
      url: verificationLink
    })

    return new Response(null, {
      status: 200
    });
});

