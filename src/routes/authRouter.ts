import { Router } from "express";
import {
  authController,
  checkUserController,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", authController);

authRouter.post("/check", checkUserController);

export default authRouter;
