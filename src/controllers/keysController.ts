import { Request, Response } from "express";
import { buildRes } from "../service/system/buildRes";
import { db } from "../db/db";
import { Keys } from "../db/schema/keysSchema";
import { and, eq } from "drizzle-orm";
import { Users } from "../db/schema/userSchema";

export const activateKeyController = async (req: Request, res: Response) => {
  const { key } = req.body;

  if (!key) {
    return buildRes(400, "No key provided", res);
  }

  const keyInDB = await db
    .select()
    .from(Keys)
    .where(eq(Keys.key, key))
    .then((keys) => keys[0]);

  if (!keyInDB) {
    return buildRes(400, "You are already premium user", res);
  }

  if (keyInDB.activatedBy) {
    return buildRes(400, "Key is already activated by the user", res);
  }

  await db
    .update(Keys)
    .set({ activatedBy: req.user.isu_id, activatedAt: new Date() })
    .where(eq(Keys.key, key));

  return buildRes(200, "Now you are premium user!", res);
};

export const checkKeyController = async (req: Request, res: Response) => {
  const { key } = req.body;

  if (!key) {
    return buildRes(400, "No key provided", res);
  }

  const keyInDB = await db
    .select()
    .from(Keys)
    .where(and(eq(Keys.key, key), eq(Keys.activatedBy, req.user.isu_id)))
    .then((keys) => keys[0]);

  if (!keyInDB) {
    return buildRes(400, "Your copy does not activated", res);
  }

  return buildRes(200, "Copy activated", res);
};

export const relinkKeyToAccountController = async (
  req: Request,
  res: Response,
) => {
  const { relink_to } = req.body;

  const accountToRelink = await db
    .select()
    .from(Users)
    .where(eq(Users.isu_id, relink_to))
    .then((accounts) => accounts[0]);

  if (!relink_to || !accountToRelink) {
    return buildRes(400, "Cant relink to blank account", res);
  }

  await db
    .update(Keys)
    .set({ activatedBy: relink_to, activatedAt: new Date() })
    .where(eq(Keys.key, req.key.key));

  return buildRes(200, "Activation account changed", res);
};
