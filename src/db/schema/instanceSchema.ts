import { boolean, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const LoadEnum = pgEnum("loadEnum", ["light", "medium", "hard"]);

export const Instances = pgTable("instances", {
  id: serial("id"),
  name: varchar("name").notNull(),
  requestsPerSecond: varchar("requests").notNull(),
  isReady: boolean("isReady").notNull().default(false),
  loadStatus: LoadEnum("loadStatus").notNull().default("light"),
});
