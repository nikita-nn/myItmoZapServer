import { Users } from "./db/models/usersModel";

declare global {
  namespace Express {
    interface Request {
      user?: typeof Users.$inferSelect;
      token?: string;
    }
  }
}
