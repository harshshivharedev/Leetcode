import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { adminMiddleware } from "../../common/middleware/admin.middleware.js";
import { getCurrentUserController } from "../users/user.controller.js";

const adminRouter = Router();

adminRouter.get(
  "/me",
  authMiddleware,
  adminMiddleware,
  getCurrentUserController,
);

export default adminRouter;
