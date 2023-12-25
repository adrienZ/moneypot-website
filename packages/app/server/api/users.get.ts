import { user } from "../database/schema"

export default defineEventHandler(() => {
  const users = db.select().from(user).all();
  return users;
})