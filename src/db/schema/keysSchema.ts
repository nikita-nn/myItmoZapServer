import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { Users } from "./userSchema";

export const Keys = pgTable("premiumKeys", {
  id: serial("id"),
  activatedAt: timestamp("activatedAt"),
  activatedBy: varchar("activatedBy").references(() => Users.isu_id),
  key: varchar("key").unique().notNull(),
});
