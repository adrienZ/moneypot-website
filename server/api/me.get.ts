import { user } from "../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return new Response(null, {
      status: 401
    });
  }

  const sessions = await lucia.getUserSessions(event.context.user.id);

  const [me] = await db
    .select()
    .from(user)
    .where(eq(user.id, event.context.user.id))
    .limit(1);

  return {
    ...me,
    sessions
  };
});
