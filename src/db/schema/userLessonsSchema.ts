import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Users } from "./userSchema";

export const UserLessons = pgTable("userLessons", {
  id: serial("id").primaryKey(),
  isu_id: varchar("isu_id").references(() => Users.isu_id),
  task_id: varchar("task_id").notNull(),
  createdAt: timestamp().defaultNow(),
  closedAt: timestamp(),
  active: boolean("active").default(true).notNull(),
});
