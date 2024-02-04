import { moneypotCategory, moneypot } from "./moneypots.schema";
import { user } from "./auth.schema";

export type MoneyPotCategory = typeof moneypotCategory.$inferSelect;
export type MoneypotInsert = typeof moneypot.$inferInsert;

export type Moneypot = typeof moneypot.$inferSelect;
export type User = typeof user.$inferSelect;
