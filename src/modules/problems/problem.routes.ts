
import { Router } from "express";
import { adminMiddleware } from "../../common/middleware/admin.middleware.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createProblemController, getProblemBySlugController, getProblemsController, updateProblemController, updateProblemPublishStatusController } from "./problem.controller.js";


const problemRouter = Router();

problemRouter.post(
    "/", 
    authMiddleware, 
    adminMiddleware,
    createProblemController
)

problemRouter.get("/", getProblemsController);
problemRouter.get("/:slug", getProblemBySlugController);
problemRouter.patch(
    "/:problemId/publish",
    authMiddleware, 
    adminMiddleware, 
    updateProblemPublishStatusController
)
problemRouter.patch(
    "/:problemId",
    authMiddleware,
    adminMiddleware,
    updateProblemController
)


export default problemRouter;