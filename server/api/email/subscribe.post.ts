import { isValidEmail } from "#myauth/helpers/email";
import { EmailService } from "~/server/lib/auth/emailService";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const email = body.email;
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return new Response("Invalid email", {
      status: 400
    });
  }

  const createdContact = await myAuth.emailService.addContact(email);

  return {
    ...createdContact
  };
});
