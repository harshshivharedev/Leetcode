
import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import usersRouter from "../modules/users/users.routes.js";
import adminRouter from "../modules/admin/admin.routes.js";
import problemRouter from "../modules/problems/problem.routes.js";


const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/admin", adminRouter);
router.use("/problems", problemRouter);

export default router;
