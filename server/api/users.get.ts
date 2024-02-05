import { user } from "../database/schema";

export default defineEventHandler(() => {
  return db.select().from(user);
});
