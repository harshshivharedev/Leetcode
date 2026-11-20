import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import {
  getCurrentUserController,
  updateProfileController,
} from "./user.controller.js";

const usersRouter = Router();

usersRouter.get("/me", authMiddleware, getCurrentUserController);
usersRouter.patch("/me", authMiddleware, updateProfileController);

export default usersRouter;
