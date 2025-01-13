import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { Users } from "./userSchema";

export const UserLessons = pgTable("userLessons", {
  id: serial("id").primaryKey(),
  isu_id: varchar("isu_id").references(() => Users.isu_id),
  createdAt: timestamp().defaultNow(),
  closedAt: timestamp(),
});
