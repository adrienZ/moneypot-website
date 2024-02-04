import { moneypotCategory } from "../database/schema";

export default defineEventHandler(async (event) => {
  const items = await db.select().from(moneypotCategory);
  return items;
});
