import { MoneypotService } from "~/server/services/MoneypotService";
import { z } from "zod";
import { MoneypotState } from "~/models/MoneypotState";
const schema = z.object({
  moneypotId: z.string().min(1)
});

export default defineEventHandler(async (event) => {
  const form = schema.safeParse(getRouterParams(event));

  if (!form.success) {
    const firstError = form.error.errors[0];
    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const item = await MoneypotService.getMoneypotByExternalId(
    form.data.moneypotId
  );

  if (!item) {
    throw createError({
      statusCode: 404
    });
  }

  if (!item.creator) {
    throw createError({
      statusCode: 400,
      statusMessage: "invalid moneypot data"
    });
  }

  return new MoneypotState(item).data;
});
