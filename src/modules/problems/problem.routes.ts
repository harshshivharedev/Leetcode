
import { Router } from "express";
import { adminMiddleware } from "../../common/middleware/admin.middleware.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createProblemController, getProblemsController } from "./problem.controller.js";


const problemRouter = Router();

problemRouter.post(
    "/", 
    authMiddleware, 
    adminMiddleware,
    createProblemController
)

problemRouter.get("/", getProblemsController);


export default problemRouter;