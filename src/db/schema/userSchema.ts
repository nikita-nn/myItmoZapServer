import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  isu_id: varchar("isu_id").notNull().unique().primaryKey(),
  password: varchar("password").notNull(),
  refresh_token: varchar("refresh_token").notNull(), // 1 month last , after - dead
  access_token: varchar("access_token").notNull(), // 30 mins last , after - dead
  accessTokenIssued: timestamp("accessTokenIssued").notNull(),
  refreshTokenIssued: timestamp("refreshTokenIssued").notNull(),
  botToken: varchar("botToken"), // Telegram bot token
  tgAccountId: varchar("tgAccountId"),
  notificationsEnabled: boolean().notNull().default(false),
});
