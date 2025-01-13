import { Request, Response } from "express";
import { authUser, writeAuthDataToDB } from "../service/auth/authService";
import { buildRes } from "../service/system/buildRes";

export const authController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userData = await authUser(username, password);

  if (!userData) {
    return buildRes(401, "Incorrect username or password", res);
  }

  const userWriteStatus = await writeAuthDataToDB(userData);
  if (userWriteStatus) {
    return buildRes(200, userData, res);
  } else {
    return buildRes(500, "Server error", res);
  }
};
