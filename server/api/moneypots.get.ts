import { MoneypotService } from "~/server/services/MoneypotService";
import { z } from "zod";
import type { IPagination } from "~/server/interfaces/pagination";

const schema = z.object({
  limit: z.coerce.number().optional()
});

export default defineEventHandler(async (event) => {
  const form = schema.safeParse(await getQuery(event));

  if (!form.success) {
    const firstError = form.error.errors[0];
    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const pagination: IPagination = {
    limit: form.data.limit
  };

  return await MoneypotService.getAllMoneypots(pagination);
});
