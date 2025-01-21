import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getMeController,
  linkTelegramController,
  switchTgNotificationsController,
  unlinkTelegramController,
} from "../controllers/user/userController";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.post("/link_tg", linkTelegramController);
userRouter.post("/unlink_tg", unlinkTelegramController);
userRouter.get("/me", getMeController);
userRouter.post("/notifications", switchTgNotificationsController);

export default userRouter;
