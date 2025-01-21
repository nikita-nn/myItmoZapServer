import { getQRImage } from "../../service/other/otherService";
import { Request, Response } from "express";
import { buildRes } from "../../service/system/buildRes";

export const getQRController = async (req: Request, res: Response) => {
  const code = await getQRImage(req.user.isu_id);
  if (!code) {
    return buildRes(400, "Can not build qr code", res);
  } else {
    return buildRes(200, code, res);
  }
};
