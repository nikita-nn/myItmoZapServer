import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { Users } from "./userSchema";

export const Keys = pgTable("premiumKeys", {
  id: serial("id"),
  activatedAt: timestamp("activatedAt"),
  activatedBy: varchar("activatedBy").references(() => Users.isu_id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  key: varchar("key").unique().notNull(),
});
