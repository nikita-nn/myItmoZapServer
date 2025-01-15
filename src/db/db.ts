import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { dbConnectionString } from "../settings";

const { Pool } = pg;

const pool = new Pool({
  connectionString: dbConnectionString,
  max: 50,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
