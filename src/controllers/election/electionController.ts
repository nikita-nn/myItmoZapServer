import { Request, Response } from "express";
import { getAvailableDisciplines } from "../../service/election/electionService";
import { buildRes } from "../../service/system/buildRes";

export const getElectionDisciplinesController = async (
  req: Request,
  res: Response,
) => {
  const disciplines = await getAvailableDisciplines(req.user.isu_id);
  if (!disciplines) {
    return buildRes(400, "Error retrieving disciplines", res);
  }

  return buildRes(200, disciplines, res);
};
