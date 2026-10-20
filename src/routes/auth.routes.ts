
import { Router } from "express";
import { registerController } from "../modules/auth/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);

export default authRouter;