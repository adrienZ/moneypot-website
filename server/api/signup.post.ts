import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { encodeHex } from "oslo/encoding";
import { HMAC } from "oslo/crypto";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { AssetsService } from "../services/AssetsService";

const formDataSchema = zfd.formData({
  password: z.string().min(6).max(255),
  email: z.string().min(1).email(),
  avatar: z.instanceof(File).optional()
});

export default eventHandler(async (event) => {
  const form = formDataSchema.safeParse(await readFormData(event));

  if (!form.success) {
    const firstError = form.error.errors[0];
    throw createError({
      message: `${firstError.path}: ${firstError.message}`,
      statusCode: 400
    });
  }

  const { password, email, avatar } = form.data;

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);
  const twoFactorSecret = await new HMAC("SHA-1").generateKey();

  try {
    let avatarUrl: string | null = null;

    if (avatar && avatar.size > 0) {
      avatarUrl = await AssetsService.uploadFile(avatar);
    }

    const createdUser = await myAuth.userTable.insertUser({
      externalId: userId,
      password: hashedPassword,
      email,
      twoFactorSecret: encodeHex(twoFactorSecret),
      avatar: avatarUrl ?? undefined
    });

    await myAuth.hooks.onUserCreation(event, createdUser);
  } catch (e) {
    throw createError({
      message: "An unknown error occurred",
      statusCode: 500
    });
  }
});
