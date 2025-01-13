import { Request, Response } from "express";
import { authUser } from "../service/auth/authService";
import { buildRes } from "../service/system/buildRes";

export const authController = async (req: Request, res: Response) => {
  const { isu_id, password } = req.body;
  const userData = await authUser(isu_id, password);

  if (!userData) {
    return buildRes(401, "Incorrect username or password", res);
  }

  return buildRes(200, userData, res);
};
