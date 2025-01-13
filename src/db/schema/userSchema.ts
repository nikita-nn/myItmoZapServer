import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  isu_id: varchar("isu_id").notNull().unique(),
  password: varchar("password").notNull(),
  refresh_token: varchar("refresh_token").notNull(),
  access_token: varchar("access_token").notNull(),
});
