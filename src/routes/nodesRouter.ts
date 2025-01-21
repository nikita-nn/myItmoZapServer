import { Router } from "express";
import { getNodesController } from "../controllers/user/nodesController";

const nodesRouter = Router();

nodesRouter.get("/", getNodesController);

export default nodesRouter;
