import { Request, Response } from "express";
import {checkCompatibilityOfDisciplines, getAvailableDisciplines} from "../../service/election/electionService";
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


export const setElectionTaskController = async (
    req: Request,
    res: Response,
) => {
  const disciplines = req.body

  if(!disciplines || !Array.isArray(disciplines) || disciplines.length == 0) {
    return buildRes(400, "Error retrieving disciplines", res);
  }

  const result = await checkCompatibilityOfDisciplines(req.user.isu_id, disciplines)

  if(!result) {
    return buildRes(400, "Election isn't compatible", res);
  }



}