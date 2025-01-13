import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id"),
  username: varchar("username").notNull(),
  password: varchar("password").notNull(),
  refresh_token: varchar("refresh_token").notNull(),
  access_token: varchar("access_token").notNull(),
});
