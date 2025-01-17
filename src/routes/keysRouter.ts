import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  activateKeyController,
  checkKeyController,
  relinkKeyToAccountController,
} from "../controllers/keysController";
import { keyCheckMiddleware } from "../middlewares/keyCheckMiddleware";

const keysRouter = Router();

keysRouter.post("/activate", authMiddleware, activateKeyController);

keysRouter.post("/check", authMiddleware, checkKeyController);

keysRouter.post(
  "/relink",
  authMiddleware,
  keyCheckMiddleware,
  relinkKeyToAccountController,
);

export default keysRouter;
