import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { adminMiddleware } from "../../common/middleware/admin.middleware.js";
import { getCurrentUserController } from "../users/user.controller.js";
import { updateUserRoleController } from "./admin.controller.js";

const adminRouter = Router();

adminRouter.patch(
  "/users/:userId/role",
  authMiddleware,
  adminMiddleware,
  updateUserRoleController,
);
adminRouter.get(
  "/me",
  authMiddleware,
  adminMiddleware,
  getCurrentUserController,
);

export default adminRouter;
