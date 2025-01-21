import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getElectionDisciplinesController } from "../controllers/election/electionController";

const electionRouter = Router();

electionRouter.use(authMiddleware);

electionRouter.get("/disciplines", getElectionDisciplinesController);

export default electionRouter;
