import { db } from "../utils/lucia";
import { generateId } from "lucia";
import { moneypotCategory } from "../database/schema/moneypots.schema";

type InsertMoneyPotCategory = typeof moneypotCategory.$inferInsert;

const moneypotCategoriesSeed: Array<
  Pick<InsertMoneyPotCategory, "image" | "value">
> = [
  {
    image:
      "https://images.unsplash.com/photo-1502035618526-6b2f1f5bca1b?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "BIRTHDAY"
  },
  {
    image:
      "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "BIRTH"
  },
  {
    image:
      "https://images.unsplash.com/photo-1544813545-4827b64fcacb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "FUNERAL"
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1661391158415-38d4e332d212?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "FAREWELL"
  },
  {
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "MARIAGE"
  },
  {
    image:
      "https://images.unsplash.com/photo-1642784353725-5a79aaaaecab?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "EVENTS"
  },
  {
    image:
      "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    value: "OTHER"
  }
];

export default defineNitroPlugin(() => {
  moneypotCategoriesSeed.forEach(async (values) =>
    db
      .insert(moneypotCategory)
      .values({
        ...values,
        externalId: generateId(10)
      })
      .onConflictDoNothing()
  );
});
