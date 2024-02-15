import { z } from "zod";
import { zfd } from "zod-form-data";

const formDataSchema = zfd.formData({
  amount: z.coerce.number().positive()
});

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401
    });
  }

  const form = formDataSchema.safeParse(await readFormData(event));

  if (!form.success) {
    const firstError = form.error.errors[0];

    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const { amount } = form.data;
  const amountInCents = amount * 1000;

  return {
    amountInCents
  };
});
