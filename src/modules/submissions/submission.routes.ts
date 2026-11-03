
import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createSubmissionController, getSubmissionController , getMySubmissionsController} from "./submission.controller.js";

const submissionRouter = Router();


submissionRouter.post("/", authMiddleware, createSubmissionController );
submissionRouter.get("/:submissionId", authMiddleware, getSubmissionController);
submissionRouter.get("/me", authMiddleware, getMySubmissionsController)

export default submissionRouter;