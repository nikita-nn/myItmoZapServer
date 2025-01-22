import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {getElectionDisciplinesController, setElectionTaskController} from "../controllers/election/electionController";

const electionRouter = Router();

electionRouter.use(authMiddleware);

electionRouter.get("/disciplines", getElectionDisciplinesController);
electionRouter.post("/start", setElectionTaskController)

export default electionRouter;
