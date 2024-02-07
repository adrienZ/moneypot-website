import { user } from "../database/schema";
import { eq } from "drizzle-orm";

export class UserService {
  static async getUserById(id: number) {
    const userFounded = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return userFounded.at(0);
  }

  static async updateUserAvatar(
    usserExternalID: string,
    imageUrl: string
  ): Promise<boolean> {
    await db
      .update(user)
      .set({
        avatar: imageUrl
      })
      .where(eq(user.externalId, usserExternalID));

    return true;
  }
}
