import { NextFunction, Request, Response } from "express";
import { db } from "../db/db";
import { Keys } from "../db/schema/keysSchema";
import { eq } from "drizzle-orm";
import { buildRes } from "../service/system/buildRes";

export const keyCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  const userKey = await db
    .select()
    .from(Keys)
    .where(eq(Keys.activatedBy, user.isu_id))
    .then((keys) => keys[0]);

  if (userKey) {
    req.key = userKey;
    next();
  } else {
    return buildRes(401, "Invalid activation key", res);
  }
};
