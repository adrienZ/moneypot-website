import { z } from "zod";

const bodySchema = z.object({
  email: z.string().min(1).email()
});

export default defineEventHandler(async (event) => {
  const validation = bodySchema.safeParse(await readBody(event));

  if (!validation.success) {
    const firstError = validation.error.errors[0];
    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const email = validation.data.email;
  const createdContact = await myAuth.emailService.addContact(email);

  return createdContact;
});
