import { eq, desc } from "drizzle-orm";
import { moneypotCategory, moneypot, user } from "../database/schema";
import { MoneypotInsert } from "../database/schema/types";
import { IPagination } from "../interfaces/pagination";

export class MoneypotService {
  static async getMoneypotCategoryById(externalId: string) {
    const results = await db
      .select()
      .from(moneypotCategory)
      .where(eq(moneypotCategory.externalId, externalId));

    return results.at(0);
  }

  static async insertMoneypot(data: MoneypotInsert) {
    const [inserted] = await db.insert(moneypot).values(data).returning();
    return inserted;
  }

  static async getMoneypotByExternalId(categoryExternalId: string) {
    const result = await db
      .select({
        externalId: moneypot.externalId,
        description: moneypot.description,
        title: moneypot.title,
        image: moneypotCategory.image,
        categoryId: moneypot.categoryId,
        creator: {
          externalId: user.externalId,
          avatar: user.avatar,
          username: user.username
        }
      })
      .from(moneypot)
      .where(eq(moneypot.externalId, categoryExternalId))
      .leftJoin(
        moneypotCategory,
        eq(moneypot.categoryId, moneypotCategory.externalId)
      )
      .leftJoin(user, eq(moneypot.creatorId, user.externalId));

    return result.at(0);
  }

  static async getAllMoneypots(params?: IPagination) {
    console.log({ params });

    const query = db
      .select({
        externalId: moneypot.externalId,
        description: moneypot.description,
        title: moneypot.title,
        image: moneypotCategory.image,
        categoryId: moneypot.categoryId
      })
      .from(moneypot)
      .leftJoin(
        moneypotCategory,
        eq(moneypot.categoryId, moneypotCategory.externalId)
      )
      .orderBy(desc(moneypot.id));

    if (params?.limit) {
      query.limit(params.limit);
    }

    return await query;
  }
}
