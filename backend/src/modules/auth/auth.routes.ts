
import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  refreshTokenController,
} from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logoutController);

export default authRouter;
