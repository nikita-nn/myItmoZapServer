import { Users } from "./db/models/usersModel";
import { Keys } from "../db/schema/keysSchema";

declare global {
  namespace Express {
    interface Request {
      user?: typeof Users.$inferSelect;
      token?: string;
      key: typeof Keys.$inferSelect;
    }
  }
}
