import { user } from "../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return new Response(null, {
      status: 401
    });
  }
  const [me] = await db
    .select()
    .from(user)
    .where(eq(user.externalId, event.context.user.externalId))
    .limit(1);

  return me;
});
