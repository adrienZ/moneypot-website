import { serial, timestamp } from "drizzle-orm/pg-core";

export const creationColumns = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
};

export const primaryKeyColumn = {
  id: serial("id").primaryKey()
};
