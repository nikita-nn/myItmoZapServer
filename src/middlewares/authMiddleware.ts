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
  const isuId = String(req.headers["x-username"])
  const password = String(req.headers["x-password"])

  if(!isuId || !password){
    return buildRes(401, "Access denied. No password or isu_id", res);
  }

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.isu_id, isuId))
    .then((users) => users[0]);

  if (!user || password != user.password) {
    return buildRes(401, "Access denied. Invalid password or isu_id", res);
  }
  req.user = user;
  next();
};
