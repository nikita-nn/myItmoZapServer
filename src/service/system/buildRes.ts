import { Response } from "express";
import { ResponseStatus, ResponseType } from "../../types/responseType";

export const buildRes = (
  status: number,
  data: string | object,
  res: Response,
) => {
  let toSend: ResponseType = {
    status: status <= 204 ? ResponseStatus.SUCCESS : ResponseStatus.ERROR,
  };

  if (status <= 204) {
    if (typeof data == "object") {
      toSend.data = data;
    } else {
      toSend.message = data;
    }
  } else {
    toSend.message = data.toString();
  }

  res.status(status).json(toSend);
};
