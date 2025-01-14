
import {integer, pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const Nodes = pgTable("nodes", {
    id: serial("id").primaryKey(),
    url: varchar("url").notNull(),
    name: varchar("name").notNull().unique(),
    ping: integer("ping")
})