import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { dbConnectionString } from "../settings";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dbCredentials: { url: dbConnectionString! },
  verbose: true,
  strict: true,
  migrations: {
    table: "migrations",
    schema: "public",
  },
});
