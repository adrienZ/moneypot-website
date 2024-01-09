import { passwordResetToken } from "../../database/schema";
import { TimeSpan, createDate } from "oslo";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

export async function createPasswordResetToken(userId: number): Promise<string> {
	// optionally invalidate all existing tokens
  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.userId, userId))
    .execute()

  const token = generateId(40);


	const [inserted] = await db
    .insert(passwordResetToken)
    .values({
      token,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h"))
    })
    .returning();

	return inserted.token;
}