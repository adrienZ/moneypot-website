import { generateId } from "lucia";
import type { user } from "../../server/database/schema/auth.schema";

export const testUser: typeof user.$inferInsert = {
  email: "test+playwright@gmail.com",
  externalId: generateId(10),
  password:
    "$argon2id$v=19$m=19456,t=2,p=1$Tf5S1sjtrcVVlFrD6Kh+Qg$i89WyYADqckI+cbN2umWf2xR0XfLscteEdqCjAexEao",
  avatar: "https://optc-db.github.io/api/images/thumbnail/jap/1/300/1391.png"
};
