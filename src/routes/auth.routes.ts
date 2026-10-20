
import { Router } from "express";
import { loginController, registerController } from "../modules/auth/auth.controller.js";
import { authMiddleware } from "../common/middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/me", authMiddleware);


export default userRouter;