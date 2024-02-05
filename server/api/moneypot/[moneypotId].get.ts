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

  // fighting against typescript object narrowing...
  const creator = item?.creator;
  const image = item?.image;

  if (!item) {
    throw createError({
      statusCode: 404
    });
  }

  if (!creator) {
    throw createError({
      statusCode: 400,
      statusMessage: "invalid moneypot data"
    });
  }

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: "invalid image data"
    });
  }

  const moneypot = {
    ...item,
    image,
    creator
  };

  return new MoneypotState(moneypot).data;
});
