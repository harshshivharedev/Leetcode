
import { Router } from "express";
import {
  loginController,
  registerController,
  refreshTokenController,
} from "../modules/auth/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshTokenController);

export default authRouter;
