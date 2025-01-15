import {pgTable, timestamp, varchar} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  isu_id: varchar("isu_id").notNull().unique().primaryKey(),
  password: varchar("password").notNull(),
  refresh_token: varchar("refresh_token").notNull(),
  access_token: varchar("access_token").notNull(),
  accessTokenIssued: timestamp("accessTokenIssued").notNull(),
  refreshTokenIssued: timestamp("refreshTokenIssued").notNull()
});
