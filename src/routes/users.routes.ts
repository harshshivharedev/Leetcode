import { Router } from "express";
import { authMiddleware } from "../common/middleware/auth.middleware.js";
import { getCurrentUserController } from "../modules/users/user.controller.js";

const usersRouter = Router();

usersRouter.get("/me", authMiddleware, getCurrentUserController);

export default usersRouter;
