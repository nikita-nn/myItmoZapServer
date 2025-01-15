import {Request, Response} from "express";
import {getLessonsData, getLessonsFullData} from "../service/PE/lessonsService";
import {buildRes} from "../service/system/buildRes";


export const getInitialLessonsInfoController = async (req: Request, res: Response) => {
    const initialData = await getLessonsData(req.user.isu_id)
    return buildRes(200, initialData, res)
}

export const getLessonsController = async (req: Request, res: Response) => {
    const date = req.query.date;
    const buildingId = req.query.buildingId

    if(!date || !buildingId){
        return buildRes(400, "Incorrect data", res);
    }

    const data = await getLessonsFullData(req.user.isu_id, Number(buildingId), String(date))

    return buildRes(200, data.filter((lessons: {date: string})=> lessons.date == date)[0].lessons, res)
}