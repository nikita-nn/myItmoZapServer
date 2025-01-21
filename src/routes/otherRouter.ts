import { Router } from "express";
import { getQRController } from "../controllers/other/otherController";
import { authMiddleware } from "../middlewares/authMiddleware";

const otherRouter = Router();

otherRouter.use(authMiddleware);

otherRouter.get("/qr", getQRController);

export default otherRouter;
