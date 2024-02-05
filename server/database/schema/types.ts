import type { moneypotCategory, moneypot } from "./moneypots.schema";
import type { user, userSession } from "./auth.schema";

export type MoneyPotCategory = typeof moneypotCategory.$inferSelect;
export type MoneypotInsert = typeof moneypot.$inferInsert;

export type Moneypot = typeof moneypot.$inferSelect;
export type User = typeof user.$inferSelect;
export type UserSession = typeof userSession.$inferSelect;
