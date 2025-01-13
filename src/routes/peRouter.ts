import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllUserLessonsController,
  signLessonController,
  stopLessonMonitoringController,
} from "../controllers/peController";

const peRouter = Router();

peRouter.use(authMiddleware);

peRouter.use("/sign", signLessonController);
peRouter.use("/active", getAllUserLessonsController);
peRouter.use("/stop", stopLessonMonitoringController);

export default peRouter;
