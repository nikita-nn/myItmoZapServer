import { Request, Response } from "express";
import { Users } from "../../db/schema/userSchema";
import { db } from "../../db/db";
import { buildRes } from "../../service/system/buildRes";
import { checkTelegramLinkStatus } from "../../service/user/telegramService";

export const linkTelegramController = async (req: Request, res: Response) => {
  const { token, userId } = req.body;
  const telegramLinkData = await checkTelegramLinkStatus(req.user.isu_id);
  if (!token || !userId) {
    return buildRes(400, "Incorrect data", res);
  }
  if (telegramLinkData) {
    return buildRes(400, "Telegram already linked", res);
  }

  await db.update(Users).set({ botToken: token, tgAccountId: userId });
  return buildRes(200, "Successfully linked telegram", res);
};

export const unlinkTelegramController = async (req: Request, res: Response) => {
  await db.update(Users).set({ botToken: null, tgAccountId: null });
  return buildRes(200, "Successfully unlinked telegram", res);
};

export const switchTgNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const { enabled } = req.body;
  const telegramLink = await checkTelegramLinkStatus(req.user.isu_id);

  if (enabled != true || enabled !== false) {
    return buildRes(400, "Incorrect data", res);
  }

  if (!telegramLink) {
    return buildRes(400, "Incorrect telegram link status", res);
  }

  await db.update(Users).set({ notificationsEnabled: enabled });
  return buildRes(200, "Successfully updated notifications status", res);
};

export const getMeController = async (req: Request, res: Response) =>
  buildRes(200, req.user, res);
