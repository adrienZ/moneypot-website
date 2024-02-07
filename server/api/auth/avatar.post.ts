import { z } from "zod";
import { zfd } from "zod-form-data";
import { AssetsService } from "~/server/services/AssetsService";
import { UserService } from "~/server/services/UserService";

const formDataSchema = zfd.formData({
  avatar: z.instanceof(File)
});

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    throw createError({
      statusCode: 401
    });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    throw createError({
      statusCode: 401
    });
  }

  const dbUser = await UserService.getUserById(Number(user.id));
  if (!dbUser) {
    throw createError({
      statusCode: 403,
      statusMessage: "invalid user data"
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

  const { avatar } = form.data;
  const previousAvatar = dbUser.avatar;

  const avatarCdnUrl = await AssetsService.uploadFile(avatar);
  const isUserUpdated = await UserService.updateUserAvatar(
    dbUser.externalId,
    avatarCdnUrl
  );

  // TODO: use a queue for this task
  // TODO: handle failing
  // optimize provider costs
  AssetsService.deleteFile(previousAvatar);

  return {
    isUserUpdated
  };
});
