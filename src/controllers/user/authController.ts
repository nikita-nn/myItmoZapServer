import { Request, Response } from "express";
import { authUser, checkUser } from "../../service/auth/authService";
import { buildRes } from "../../service/system/buildRes";

export const authController = async (req: Request, res: Response) => {
  const { isu_id, password } = req.body;
  try {
    const userData = await authUser(isu_id, password);
    if (!userData) {
      return buildRes(401, "Incorrect username or password", res);
    }

    return buildRes(200, userData, res);
  } catch (e) {
    return buildRes(500, `Server error ${e.message}`, res);
  }
};

export const checkUserController = async (req: Request, res: Response) => {
  const { isu_id } = req.body;
  if (!isu_id) {
    return buildRes(401, "No ISU ID provided", res);
  }
  const isUser = await checkUser(isu_id);

  if (isUser) {
    return buildRes(200, "User is existing in db", res);
  } else {
    return buildRes(401, "User is missing from db", res);
  }
};
