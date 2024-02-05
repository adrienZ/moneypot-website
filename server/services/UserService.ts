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

  static async updateUserAvatar(imageUrl: string): Promise<boolean> {
    const updated = await db.update(user).set({
      avatar: imageUrl
    });

    return Boolean(updated.length > 0);
  }
}
