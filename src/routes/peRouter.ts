import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllUserLessonsController,
  signLessonController,
} from "../controllers/peController";

const peRouter = Router();

peRouter.use(authMiddleware);

peRouter.use("/sign", signLessonController);
peRouter.use("/active", getAllUserLessonsController);

export default peRouter;
