import {Request, Response} from "express";
import {db} from "../db/db";
import {Nodes} from "../db/schema/nodesSchema";
import {buildRes} from "../service/system/buildRes";
import {checkNodePing} from "../service/system/healthCheck";

export const getNodesController = async(req: Request, res: Response) => {
    const nodes = await db.select().from(Nodes)
    return buildRes(200, nodes, res)
}