import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllUserLessonsController,
  signLessonController,
  stopLessonMonitoringController,
} from "../controllers/peController";
import {
  getInitialLessonsInfoController,
  getLessonsController
} from "../controllers/lessonsController";

const peRouter = Router();

peRouter.use(authMiddleware);

peRouter.post("/sign", signLessonController);
peRouter.get("/active", getAllUserLessonsController);
peRouter.post("/stop", stopLessonMonitoringController);

peRouter.get("/lessons_initial", getInitialLessonsInfoController)
peRouter.get("/lessons",  getLessonsController)

export default peRouter;
