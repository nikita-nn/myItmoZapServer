import { NextFunction, Request, Response } from "express";
import { db } from "../db/db";
import { Users } from "../db/schema/userSchema";
import { eq } from "drizzle-orm";
import { buildRes } from "../service/system/buildRes";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { isu_id, token } = req.body;

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.isu_id, isu_id))
    .then((users) => users[0]);
  if (!user || token != user.refresh_token) {
    return buildRes(401, "Access denied. Invalid token or isu_id", res);
  }
  req.user = user;
  next();
};
