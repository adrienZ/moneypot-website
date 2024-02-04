import { generateId } from "lucia";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { MoneypotService } from "~/server/services/MoneypotService";
import { UserService } from "~/server/services/UserService";

const formDataSchema = zfd.formData({
  categoryId: z.string().length(10),
  title: z.string().min(3).max(255),
  description: z.string().min(1)
});

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      status: 401
    });
  }

  const form = formDataSchema.safeParse(await readFormData(event));

  if (!form.success) {
    const firstError = form.error.errors[0];
    console.log(form.error);

    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const { categoryId, description, title } = form.data;

  const moneypotCategory =
    await MoneypotService.getMoneypotCategoryById(categoryId);
  if (!moneypotCategory) {
    throw createError({
      status: 400,
      message: "invalid category id"
    });
  }

  const creator = await UserService.getUserById(event.context.user.id);

  const createdMoneypot = await MoneypotService.insertMoneypot({
    categoryId: moneypotCategory.externalId,
    description,
    title,
    externalId: generateId(10),
    creatorId: creator?.externalId
  });

  return createdMoneypot;
});
