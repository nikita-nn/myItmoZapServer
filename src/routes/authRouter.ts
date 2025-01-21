import { Router } from "express";
import {
  authController,
  checkUserController,
} from "../controllers/user/authController";

const authRouter = Router();

authRouter.post("/login", authController);

authRouter.post("/check", checkUserController);

export default authRouter;
